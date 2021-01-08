# frozen_string_literal: true

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

    resources :planners, only: :index do
      resources :planner_events, only: %i[index create update destroy], shallow: true
    end
  end
end
