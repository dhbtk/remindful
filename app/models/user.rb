# frozen_string_literal: true

class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable

  has_many :habits, dependent: :destroy
  has_many :habit_events, through: :habits, dependent: :destroy
  has_many :planner_events, dependent: :destroy
  has_many :water_glasses, dependent: :destroy

  enum pronouns: {
    female: 'female',
    male: 'male',
    neutral: 'neutral'
  }

  validates :username, presence: true
  validates :name, :avatar_url, presence: true, unless: :anonymous?

  class << self
    def find_for_database_authentication(warden_conditions)
      conditions = warden_conditions.dup
      if (login = conditions.delete(:email))
        where(conditions.to_hash).find_by('username = ? OR lower(email) = ?', login, login.downcase)
      else
        find_by(conditions.to_hash)
      end
    end
  end

  def update_current_events(date = Time.zone.today)
    recreate_pending_habits(date)
    create_events_for_date(date)
    destroy_stale_events(date)
    recreate_pending_planner_events(date)
  end

  protected

  def email_required?
    !anonymous?
  end

  def send_email_changed_notification?
    saved_change_to_email? && email_before_last_save.present?
  end

  private

  def recreate_pending_planner_events(date)
    planner_events.pending.where(event_date: date.prev_day).find_each do |planner_event|
      planner_event.recreate_pending(date)
    end
  end

  def recreate_pending_habits(date)
    habit_events.pending.where(event_date: date.prev_day).find_each do |habit_event|
      habit_event.recreate_pending(date)
    end
  end

  def create_events_for_date(date)
    habits.active(date).find_each do |habit|
      habit.habit_events.pending.create(event_date: date) if habit.visible_at(date)
    end
  end

  def destroy_stale_events(date)
    habit_events.where(event_date: date, original_date: nil).includes(:habit).find_each do |habit_event|
      habit_event.destroy unless habit_event.habit.visible_at(date)
    end
  end
end
