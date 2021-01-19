# frozen_string_literal: true

class HabitEvent < ApplicationRecord
  include EventStatus
  belongs_to :habit

  validates :event_date, uniqueness: { scope: %i[habit] }
  validates :event_date, presence: true

  def self.for_date(date)
    date ||= Time.zone.today

    where(event_date: date).includes(:habit).order(:created_at)
  end

  def recreate_pending(new_date)
    HabitEvent.create(
      habit: habit,
      status: 'pending',
      original_date: original_date || event_date,
      event_date: new_date
    )
  end
end
