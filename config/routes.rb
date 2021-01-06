Rails.application.routes.draw do
  use_doorkeeper do
    skip_controllers :authorizations, :applications, :authorized_applications
  end
  devise_for :users
  namespace :api, defaults: { format: :json } do
    resource :light_user, only: :create
  end
end
