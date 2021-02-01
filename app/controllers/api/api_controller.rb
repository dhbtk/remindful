# frozen_string_literal: true

module Api
  class ApiController < ApplicationController
    before_action :authenticate_user!
    skip_before_action :verify_authenticity_token

    rescue_from ActiveRecord::RecordNotFound do
      head :not_found
    end
  end
end
