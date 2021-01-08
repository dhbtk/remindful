# frozen_string_literal: true

module Api
  class LightUsersController < ApiController
    skip_before_action :doorkeeper_authorize!, only: :create

    def create
      @light_user = LightUser.create(light_user_params)

      head :unprocessable_entity unless @light_user.saved?
    end

    private

    def light_user_params
      params.permit(:client_id)
    end
  end
end
