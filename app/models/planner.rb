# frozen_string_literal: true

class Planner < ApplicationRecord
  belongs_to :user
  has_many :planner_events, dependent: :restrict_with_error
end
