# frozen_string_literal: true

module Api
  class ApiController < ActionController::API
    before_action :doorkeeper_authorize!

    protected

    def current_user
      @current_user ||= User.find_by(id: doorkeeper_token[:resource_owner_id])
    end
  end
end
