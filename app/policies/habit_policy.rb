class HabitPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.where(user: user)
    end
  end

  all_actions do
    record.user == user
  end
end