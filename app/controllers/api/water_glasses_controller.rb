# frozen_string_literal: true

module Api
  class WaterGlassesController < ApiController
    def index
      @water_glasses = current_user.water_glasses.for_date(params[:date].to_date)
    end

    def create
      @water_glass = current_user.water_glasses.build(water_glass_params)

      if @water_glass.save
        head :ok
      else
        head :unprocessable_entity
      end
    end

    def destroy
      @water_glass = current_user.water_glasses.find(params[:id])
      @water_glass.destroy
      head :ok
    end

    private

    def water_glass_params
      params.require(:water_glass).permit(:day, :drank_at)
    end
  end
end
