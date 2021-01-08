# frozen_string_literal: true

module Api
  class PlannerEventsController < ApiController
    def index
      @planner_events = planner.planner_events
    end

    def create
      @planner_event = planner.planner_events.build(planner_event_params)

      if @planner_event.save
        head :ok
      else
        head :unprocessable_entity
      end
    end

    def update
      @planner_event = policy_scope(PlannerEvent).find(params[:id])

      if @planner_event.update(planner_event_params)
        head :ok
      else
        head :unprocessable_entity
      end
    end

    def destroy
      @planner_event = policy_scope(PlannerEvent).find(params[:id])
      @planner_event.soft_delete

      head :ok
    end

    private

    def planner
      current_user.planners.find_or_create_by(plan_date: params[:planner_id].to_date)
    end

    def planner_event_params
      params.require(:planner_event).permit(:content, :status, :acted_at)
    end
  end
end
