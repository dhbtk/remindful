# frozen_string_literal: true

class TaskPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.merge(user.tasks)
    end
  end

  all_actions do
    record.user == user
  end
end
