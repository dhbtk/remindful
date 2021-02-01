# frozen_string_literal: true

json.errors do
  json.array! object.errors do |error|
    json.extract! error, :attribute, :type, :options
  end
end
