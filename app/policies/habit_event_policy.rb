class HabitEventPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.merge(user.habit_events)
    end
  end

  all_actions do
    record.habit.user == user
  end
end