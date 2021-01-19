# frozen_string_literal: true

class PlannerEvent < ApplicationRecord
  include SoftDelete
  include EventStatus
  belongs_to :user

  validates :content, :event_date, presence: true

  def self.for_date(date)
    date ||= Time.zone.today

    where(event_date: date).not_deleted.order(:created_at)
  end

  def recreate_pending(new_date)
    PlannerEvent.create(
      user: user,
      status: 'pending',
      original_date: original_date || event_date,
      event_date: new_date,
      content: content
    )
  end
end
