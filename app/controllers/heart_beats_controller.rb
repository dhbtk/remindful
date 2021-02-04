# frozen_string_literal: true

class HeartBeatsController < ApplicationController
  def show
    render json: { status: :ok }
  end
end
