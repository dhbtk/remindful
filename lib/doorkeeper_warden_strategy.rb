# frozen_string_literal: true

class DoorkeeperWardenStrategy < Warden::Strategies::Base
  def valid?
    token.present? && token.accessible? && token.acceptable?(nil)
  end

  def authenticate!
    user = User.find_by(id: token.resource_owner_id)

    if user
      success!(user)
    else
      fail!
    end
  end

  private

  def token
    @token ||= Doorkeeper::OAuth::Token.authenticate(request, *Doorkeeper.config.access_token_methods)
  end
end
