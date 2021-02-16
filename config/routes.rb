# frozen_string_literal: true

require 'sidekiq/web'
require 'sidekiq/cron/web'

Rails.application.routes.draw do
  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'
  use_doorkeeper do
    skip_controllers :authorizations, :applications, :authorized_applications
  end
  devise_for :users, skip: :all
  devise_for :super_users
  namespace :api, defaults: { format: :json } do
    resource :light_user, only: :create
    resource :user, controller: 'user/registrations', only: %i[show create update destroy] do
      resource :password, controller: 'user/passwords', only: %i[create update]
    end

    resources :habits, only: %i[index show create update destroy] do
      post :reorder, on: :collection
    end

    resources :tasks, only: %i[index create update destroy] do
      post :reorder, on: :collection
    end

    resources :water_glasses, only: %i[index create destroy]
  end

  authenticate :super_user do
    mount Sidekiq::Web, at: '/sidekiq'
  end

  resource :heart_beat, only: :show
  resource :web_app, controller: :web_app, only: :show
  get 'web_app/password', as: :edit_password, to: 'web_app#show'

  get 'web_app/*other', to: 'web_app#show'
  root to: redirect('/web_app')
end
