# frozen_string_literal: true

class PlannerEventPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.merge(user.planner_events)
    end
  end

  all_actions do
    record.user == user
  end
end
