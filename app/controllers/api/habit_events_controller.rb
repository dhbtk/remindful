# frozen_string_literal: true

module Api
  class HabitEventsController < ApiController
    def index
      @habit_events = policy_scope(HabitEvent).for_date(params[:date]&.to_date)
    end

    def update
      @habit_event = policy_scope(HabitEvent).find(params[:id])

      if @habit_event.update(habit_event_params)
        head :no_content
      else
        head :unprocessable_entity
      end
    end

    private

    def habit_event_params
      params.require(:habit_event).permit(:status, :acted_at)
    end
  end
end
