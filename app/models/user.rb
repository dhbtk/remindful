class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable

  has_many :habits
  has_many :habit_events, through: :habits

  class << self
    def authenticate(email, password)
      user = find_for_database_authentication(email: email)
      user&.valid_password?(password) ? user : nil
    end

    def find_for_database_authentication(warden_conditions)
      conditions = warden_conditions.dup
      if (login = conditions.delete(:email))
        where(conditions.to_hash).where('username = ? OR lower(email) = ?', login, login.downcase).first
      else
        where(conditions.to_hash).first
      end
    end
  end

  def create_habit_events(date = Date.today)
    habit_events.pending.where(event_date: date.prev_day).find_each do |habit_event|
      habit_event.recreate_pending(date)
    end
    habits.active(date).find_each do |habit|
      if habit.visible_at(date)
        habit.habit_events.pending.create(event_date: date)
      end
    end
  end
end
