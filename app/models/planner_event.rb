# frozen_string_literal: true

class PlannerEvent < ApplicationRecord
  include SoftDelete
  include EventStatus
  belongs_to :user

  validates :content, :event_date, presence: true

  def self.for_date(date)
    date ||= Time.zone.today

    where(event_date: date).not_deleted.order(Arel.sql('event_date, coalesce("order", id)'))
  end

  def self.overdue(date)
    pending.where(arel_table[:event_date].lt(date)).not_deleted.order(Arel.sql('coalesce("order", id), event_date'))
  end

  def self.reorder(entities, sorted_ids)
    sorted_ids.each_with_index do |id, index|
      entities.find { |e| e.id == id }.update(order: index)
    end
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
