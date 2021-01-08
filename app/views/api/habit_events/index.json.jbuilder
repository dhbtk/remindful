# frozen_string_literal: true

json.array! @habit_events do |habit_event|
  json.extract! habit_event, :id, :status, :acted_at, :event_date, :original_date
  json.habit do
    json.partial! 'api/habits/habit', habit: habit_event.habit
  end
end
