# frozen_string_literal: true

require 'rspec/expectations'

RSpec::Matchers.define :include_json do |*expected|
  match do |actual|
    @actual = extract_hash(actual)
    include(*expected).matches?(@actual)
  end

  diffable

  description do
    "render JSON with #{expected}"
  end

  def extract_hash(data)
    if data.respond_to?(:body)
      extract_hash(data.body)
    else
      JSON.parse(data).with_indifferent_access
    end
  end
end
