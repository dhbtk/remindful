# frozen_string_literal: true

require_relative 'cloud_watch_logger/stream'

module CloudWatchLogger
  def self.create(group:, stream:)
    stream = CloudWatchLogger::Stream.new(group: group, stream: stream)
    ActiveSupport::Logger.new(stream)
  end
end
