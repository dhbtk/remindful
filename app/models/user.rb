class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable

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
end
