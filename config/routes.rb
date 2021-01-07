Rails.application.routes.draw do
  use_doorkeeper do
    skip_controllers :authorizations, :applications, :authorized_applications
  end
  devise_for :users
  namespace :api, defaults: { format: :json } do
    resource :light_user, only: :create

    resources :habits, only: %i[index show create update destroy] do
      post :reorder, on: :collection
    end

    resources :habit_events, only: %i[index update]
  end
end
