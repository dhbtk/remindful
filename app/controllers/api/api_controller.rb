# frozen_string_literal: true

module Api
  class ApiController < ActionController::API
    include Pundit
    before_action :doorkeeper_authorize!

    rescue_from ActiveRecord::RecordNotFound do
      head :not_found
    end

    protected

    def current_user
      @current_user ||= User.find_by(id: doorkeeper_token[:resource_owner_id])
    end
  end
end
