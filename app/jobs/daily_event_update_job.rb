# frozen_string_literal: true

class DailyEventUpdateJob < ApplicationJob
  def perform
    User.all.find_each(&:update_daily_tasks)
  end
end
