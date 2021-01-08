# frozen_string_literal: true

FactoryBot.define do
  factory :planner_event do
    planner
    content { Faker::Hipster.sentence }
    status { 'pending' }
    acted_at { nil }
  end

  factory :planner_event_params, class: Hash do
    initialize_with { attributes }

    content { Faker::Hipster.sentence }
    status { 'pending' }
  end
end
