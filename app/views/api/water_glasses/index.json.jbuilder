# frozen_string_literal: true

json.array! @water_glasses do |water_glass|
  json.extract! water_glass, :id, :day, :drank_at
end
