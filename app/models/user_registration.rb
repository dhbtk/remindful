# frozen_string_literal: true

class UserRegistration
  include ActiveModel::Model
  attr_accessor :user, :email, :name, :avatar_url, :password, :password_confirmation, :pronouns

  validates :user, :email, :name, :avatar_url, :password, :password_confirmation, :pronouns, presence: true

  validate :user_is_anonymous
  validate :email_is_unique
  validate :passwords_match

  def save
    return false if invalid?
    return @status unless @status.nil?

    @status = user.update(update_params)
    errors.merge!(user.errors) if @status == false
    @status
  end

  def saved?
    @status
  end

  private

  def update_params
    {
      anonymous: false,
      email: email,
      name: name,
      avatar_url: avatar_url,
      password: password,
      password_confirmation: password_confirmation,
      pronouns: pronouns
    }
  end

  def user_is_anonymous
    return if user.anonymous?

    errors.add(:user, :not_anonymous)
  end

  def email_is_unique
    return unless User.exists?(email: email&.strip&.downcase)

    errors.add(:email, :uniqueness)
  end

  def passwords_match
    return if password == password_confirmation

    errors.add(:password_confirmation, :does_not_match)
  end
end
