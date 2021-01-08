# frozen_string_literal: true

Doorkeeper.configure do
  orm :active_record

  resource_owner_from_credentials do |_routes|
    request.params[:user] = { email: request.params[:username], password: request.params[:password] }
    request.env['warden'].logout(:user)
    request.env['devise.allow_params_authentication'] = true
    # Set `store: false` to stop Warden from storing user in session
    # https://github.com/doorkeeper-gem/doorkeeper/issues/475#issuecomment-305517549
    request.env['warden'].authenticate!(scope: :user, store: false)
  end

  access_token_expires_in nil

  grant_flows %w[password]

  allow_blank_redirect_uri true

  skip_authorization { true }
end
