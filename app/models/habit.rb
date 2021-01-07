class Habit < ApplicationRecord
  belongs_to :user
  has_many :habit_events

  validates :name, uniqueness: { scope: %i[user] }
  validates :name, :repeat_interval, :repeat_interval_unit, :start_date, presence: true
  validates :notification_time, presence: true, if: -> { notify? }

  enum repeat_interval_unit: {
    day: 'day',
    week: 'week',
    month: 'month'
  }, _prefix: :repeat_interval

  def self.active(date)
    where('habits.deleted_at IS NULL OR habits.deleted_at > ?', date.beginning_of_day)
      .where(arel_table[:start_date].lteq(date))
  end

  def visible_at(date)
    if repeat_interval_day?
      (date - start_date) % repeat_interval == 0
    elsif repeat_interval_week?
      interval = repeat_interval * 7
      (date - start_date) % interval == 0
    elsif repeat_interval_month?
      start_date.day == date.day
    else
      false
    end
  end
end
