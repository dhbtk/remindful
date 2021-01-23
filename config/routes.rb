# frozen_string_literal: true

Rails.application.routes.draw do
  use_doorkeeper do
    skip_controllers :authorizations, :applications, :authorized_applications
  end
  devise_for :users, skip: :all
  namespace :api, defaults: { format: :json } do
    resource :light_user, only: :create
    resource :user, controller: 'api/user/registrations', only: %i[create update destroy] do
      resource :password, controller: 'api/user/passwords', only: %i[create update]
    end

    resources :habits, only: %i[index show create update destroy] do
      post :reorder, on: :collection
    end

    resources :habit_events, only: %i[index update]
    resources :planner_events, only: %i[index create update destroy] do
      post :reorder, on: :collection
    end

    resources :water_glasses, only: %i[index create destroy]
  end

  resource :web_app, controller: :web_app, only: :show
  get 'web_app/password', as: :edit_password, to: 'web_app#show'

  get 'web_app/*other', to: 'web_app#show'
  root to: redirect('/web_app')
end
