class HabitEvent < ApplicationRecord
  belongs_to :habit

  enum status: {
    pending: 'pending',
    done: 'done',
    dismissed: 'dismissed'
  }

  validates :event_date, uniqueness: { scope: %i[habit] }
  validates :event_date, :status, presence: true
  validates :acted_at, presence: true, unless: -> { pending? }

  def recreate_pending(new_date)
    HabitEvent.create(
      habit: habit,
      status: 'pending',
      original_date: original_date || event_date,
      event_date: new_date
    )
  end
end
