# frozen_string_literal: true

module Api
  class HabitsController < ApiController
    before_action :set_habit, only: %i[show update destroy]

    def index
      @habits = policy_scope(Habit)
    end

    def create
      @habit = current_user.habits.build(habit_params)

      if @habit.save
        current_user.update_daily_tasks
        render :show
      else
        head :unprocessable_entity
      end
    end

    def show; end

    def update
      if @habit.update(habit_params)
        current_user.update_daily_tasks
        render :show
      else
        head :unprocessable_entity
      end
    end

    def destroy
      @habit.soft_delete

      current_user.update_daily_tasks
      head :no_content
    end

    private

    def set_habit
      @habit = policy_scope(Habit).find(params[:id])
      authorize @habit
    end

    def habit_params
      params.require(:habit).permit(:name, :repeat_interval, :repeat_interval_unit, :start_date, :notify,
                                    :notification_time, :repeat_sunday, :repeat_monday, :repeat_tuesday,
                                    :repeat_wednesday, :repeat_thursday, :repeat_friday, :repeat_saturday)
    end
  end
end
