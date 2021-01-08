# frozen_string_literal: true

class LightUser
  include ActiveModel::Model

  attr_accessor :username, :password, :client_id, :user, :access_token

  validates :username, :password, :client_id, presence: true

  def self.create(params)
    new(params.merge(username: SecureRandom.uuid, password: SecureRandom.hex(16))).tap(&:save)
  end

  def save
    return false if invalid?

    self.user = create_user
    self.access_token = create_access_token
    true
  end

  def saved?
    user&.persisted? && access_token&.persisted?
  end

  private

  def create_user
    User.create(username: username, email: bogus_email, password: password, password_confirmation: password,
                anonymous: true)
  end

  def create_access_token
    Doorkeeper::AccessToken.create(
      resource_owner_id: user.id,
      application_id: Doorkeeper::Application.find_by!(uid: client_id).id,
      scopes: '',
      use_refresh_token: true
    )
  end

  def bogus_email
    "#{username}@#{username}"
  end
end
