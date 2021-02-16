# frozen_string_literal: true

module Api
  class TasksController < ApiController
    def index
      @tasks = if params[:overdue].present?
                 policy_scope(Task).overdue(Time.zone.today)
               else
                 policy_scope(Task).for_date(params[:date].presence || Time.zone.today)
               end
    end

    def reorder
      Task.reorder(policy_scope(Task).where(id: reorder_params), reorder_params)
      head :no_content
    end

    def create
      @task = policy_scope(Task).build(task_params)

      if @task.save
        head :no_content
      else
        head :unprocessable_entity
      end
    end

    def update
      @task = policy_scope(Task).find(params[:id])

      if @task.update(task_params)
        head :no_content
      else
        head :unprocessable_entity
      end
    end

    def destroy
      @task = policy_scope(Task).find(params[:id])
      @task.soft_delete

      head :no_content
    end

    private

    def reorder_params
      Array(params.permit(ids: [])&.dig(:ids)).map(&:to_i)
    end

    def task_params
      params.require(:task).permit(:content, :status, :event_date, :acted_at, :deleted_at)
    end
  end
end
