# frozen_string_literal: true

class Habit < ApplicationRecord
  include SoftDelete
  belongs_to :user
  has_many :tasks, dependent: :restrict_with_error

  validates :name, uniqueness: { scope: %i[user] }
  validates :name, :repeat_interval, :repeat_interval_unit, :start_date, presence: true
  validates :notification_time, presence: true, if: -> { notify? }

  enum repeat_interval_unit: {
    day: 'day',
    week: 'week',
    month: 'month',
    business_day: 'business_day',
    weekend: 'weekend',
    weekday: 'weekday'
  }, _prefix: :repeat_interval

  def self.active(date)
    where('habits.deleted_at IS NULL OR habits.deleted_at > ?', date.beginning_of_day)
      .where(arel_table[:start_date].lteq(date))
  end

  def visible_at(date)
    return false if deleted_at.present? && deleted_at < date.end_of_day
    return false if date < created_at.to_date

    send(:"visible_at_#{repeat_interval_unit}", date)
  end

  private

  def visible_at_day(date)
    ((date - start_date) % repeat_interval).zero?
  end

  def visible_at_week(date)
    interval = repeat_interval * 7
    ((date - start_date) % interval).zero?
  end

  def visible_at_month(date)
    start_date.day == date.day
  end

  def visible_at_business_day(date)
    !date.saturday? && !date.sunday?(date)
  end

  def visible_at_weekend(date)
    date.saturday? || date.sunday?
  end

  def visible_at_weekday(date)
    days = %i[sunday monday tuesday wednesday thursday friday saturday]
    days.any? do |day|
      date.public_send("#{day}?") && send("visible_#{day}")
    end
  end
end
