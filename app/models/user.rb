# frozen_string_literal: true

class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable

  has_many :habits, dependent: :destroy
  has_many :tasks, dependent: :destroy
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

  def update_daily_tasks(date = Time.zone.today)
    create_tasks_for_date(date)
    destroy_stale_tasks(date)
  end

  protected

  def email_required?
    !anonymous?
  end

  def send_email_changed_notification?
    saved_change_to_email? && email_before_last_save.present?
  end

  private

  def create_tasks_for_date(date)
    habits.active(date).find_each do |habit|
      habit.create_task(date)
    end
  end

  def destroy_stale_tasks(date)
    tasks.where(event_date: date).joins(:habit).includes(:habit).find_each do |task|
      task.destroy unless task.habit.visible_at(date)
    end
  end
end
