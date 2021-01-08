# frozen_string_literal: true

module UserAuthorization
  def user_authorization
    return {} unless respond_to?(:user)

    token = Doorkeeper::AccessToken.find_by(resource_owner_id: user.id)
    token ||= create(:access_token, resource_owner_id: user.id)
    { 'Authorization' => "Bearer #{token.token}" }
  end
end
