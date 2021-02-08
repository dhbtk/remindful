# frozen_string_literal: true

require 'aws-sdk-cloudwatchlogs'

module CloudWatchLogger
  class Stream
    def initialize(group:, stream:)
      @group = group
      @stream = stream
      @mutex = Mutex.new
      @queue = []
      @exiting = false
      @sequence_token = nil
      @thread = Thread.new { thread_loop }
      at_exit { exit_thread }
    end

    def write(msg)
      @mutex.synchronize do
        @queue << [Time.now.utc.to_i * 1000, msg]
      end
      # rubocop:disable Rails/Output
      $stdout.write(msg)
      # rubocop:enable Rails/Output
    end

    def close
      nil
    end

    private

    def thread_loop
      loop do
        messages = extract_messages
        exiting = messages.any? { |m| m == :__delivery_thread_exit_signal__ }
        messages.reject! { |m| m == :__delivery_thread_exit_signal__ }

        deliver_messages(messages) if messages.any?
        break if exiting

        sleep(1)
      end
    end

    def extract_messages
      @mutex.synchronize do
        messages = @queue.dup
        @queue.clear
        messages
      end
    end

    def deliver_messages(messages)
      ensure_log_stream
      begin
        event = build_event(messages)
        response = client.put_log_events(event)
        raise response.rejected_log_events_info.inspect if response.rejected_log_events_info.present?

        @sequence_token = response.next_sequence_token
      rescue Aws::CloudWatchLogs::Errors::InvalidSequenceTokenException => e
        @sequence_token = e.message.split.last
        retry
      end
    end

    def build_event(messages)
      event = {
        log_group_name: @group,
        log_stream_name: @stream,
        log_events: log_events(messages)
      }
      event[:sequence_token] = @sequence_token if @sequence_token
      event
    end

    def log_events(messages)
      messages.map do |timestamp, message|
        {
          timestamp: timestamp,
          message: message
        }
      end
    end

    def exit_thread
      @exiting = true
      @mutex.synchronize do
        @queue << :__delivery_thread_exit_signal__
      end
    end

    def client
      @client ||= Aws::CloudWatchLogs::Client.new(
        access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),
        secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key),
        region: Rails.application.credentials.dig(:aws, :region)
      )
    end

    def ensure_log_stream
      return true if @log_stream_created

      begin
        client.create_log_stream(log_group_name: @group, log_stream_name: @stream)
      rescue Aws::CloudWatchLogs::Errors::ResourceNotFoundException
        client.create_log_group(log_group_name: @group)
        retry
      rescue Aws::CloudWatchLogs::Errors::ResourceAlreadyExistsException
        # nop
      end

      @log_stream_created = true
    end
  end
end
