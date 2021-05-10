# frozen_string_literal: true

class TaskIndex
  def initialize(scope, params)
    @scope = scope
    @date = ActiveModel::Type::Date.new.cast(params[:date]) || Time.zone.today
    @dates = params[:dates].presence&.map { |date| ActiveModel::Type::Date.new.cast(date) }
    @overdue = ActiveModel::Type::Boolean.new.cast(params[:overdue])
    @habit_id = params[:habit_id]
  end

  def index
    if @overdue
      @scope.overdue(@date)
    elsif @habit_id
      @scope.for_habit(@habit_id)
    elsif @dates
      @scope.for_date(@dates)
    else
      @scope.for_date(@date)
    end
  end
end
