# frozen_string_literal: true

class HabitEvent < ApplicationRecord
  include EventStatus
  belongs_to :habit

  enum status: {
    pending: 'pending',
    done: 'done',
    dismissed: 'dismissed'
  }

  validates :event_date, uniqueness: { scope: %i[habit] }
  validates :event_date, presence: true

  def recreate_pending(new_date)
    HabitEvent.create(
      habit: habit,
      status: 'pending',
      original_date: original_date || event_date,
      event_date: new_date
    )
  end
end
