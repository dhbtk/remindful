# frozen_string_literal: true

FactoryBot.define do
  factory :planner do
    user { nil }
    plan_date { '2021-01-08' }
  end
end
