module Api
  class HabitsController < ApiController
    before_action :set_habit, only: %i[show update destroy]

    def index
      @habits = policy_scope(Habit)
    end

    def create
      @habit = current_user.habits.build(habit_params)

      if @habit.save
        render :show
      else
        head :unprocessable_entity
      end
    end

    def show; end

    def update
      if @habit.update(habit_params)
        render :show
      else
        head :unprocessable_entity
      end
    end

    def destroy
      @habit.soft_delete

      head :ok
    end

    private

    def set_habit
      @habit = Habit.find(params[:id])
      authorize @habit
    end

    def habit_params
      params.require(:habit).permit(:name, :repeat_interval, :repeat_interval_unit, :start_date, :notify, :notification_time)
    end
  end
end