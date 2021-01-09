# frozen_string_literal: true

json.array! @planner_events do |planner_event|
  json.extract! planner_event, :id, :original_date, :content, :status, :acted_at, :deleted_at
end
