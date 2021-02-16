# frozen_string_literal: true

class Task < ApplicationRecord
  include SoftDelete
  belongs_to :user
  belongs_to :habit, optional: true

  enum status: {
    pending: 'pending',
    done: 'done',
    dismissed: 'dismissed'
  }

  validates :status, presence: true
  validates :acted_at, presence: true, unless: -> { pending? }
  validates :content, :event_date, presence: true

  def self.for_display
    includes(:habit).not_deleted.order(Arel.sql('event_date, coalesce("order", id)'))
  end

  def self.for_date(date)
    date ||= Time.zone.today

    where(event_date: date).for_display
  end

  def self.overdue(date)
    pending.where(arel_table[:event_date].lt(date)).for_display
  end

  def self.reorder(entities, sorted_ids)
    sorted_ids.each_with_index do |id, index|
      entities.find { |e| e.id == id }.update(order: index)
    end
  end
end
