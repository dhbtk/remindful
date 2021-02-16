# frozen_string_literal: true

json.array! @tasks do |task|
  json.extract! task, :id, :event_date, :content, :status, :acted_at, :deleted_at, :order, :habit_id
  if task.habit
    json.habit do
      json.partial! 'api/habits/habit', habit: task.habit
    end
  end
end
