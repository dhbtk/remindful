# frozen_string_literal: true

class PlannerEvent < ApplicationRecord
  include SoftDelete
  include EventStatus
  belongs_to :planner
end
