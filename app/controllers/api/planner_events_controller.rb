# frozen_string_literal: true

module Api
  class PlannerEventsController < ApiController
    def index
      @planner_events = if params[:overdue].present?
                          policy_scope(PlannerEvent).overdue(Time.zone.today)
                        else
                          policy_scope(PlannerEvent).for_date(params[:date].presence || Time.zone.today)
                        end
    end

    def reorder
      PlannerEvent.reorder(policy_scope(PlannerEvent).where(id: reorder_params), reorder_params)
      head :no_content
    end

    def create
      @planner_event = policy_scope(PlannerEvent).build(planner_event_params)

      if @planner_event.save
        head :no_content
      else
        head :unprocessable_entity
      end
    end

    def update
      @planner_event = policy_scope(PlannerEvent).find(params[:id])

      if @planner_event.update(planner_event_params)
        head :no_content
      else
        head :unprocessable_entity
      end
    end

    def destroy
      @planner_event = policy_scope(PlannerEvent).find(params[:id])
      @planner_event.soft_delete

      head :no_content
    end

    private

    def planner
      current_user.planners.find_or_create_by(plan_date: params[:planner_id].to_date)
    end

    def reorder_params
      Array(params.permit(ids: [])&.dig(:ids)).map(&:to_i)
    end

    def planner_event_params
      params.require(:planner_event).permit(:content, :status, :event_date, :acted_at, :deleted_at)
    end
  end
end
