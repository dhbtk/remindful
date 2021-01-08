# frozen_string_literal: true

FactoryBot.define do
  factory :habit_event do
    event_date { Date.new(2021, 1, 6) }
    status { 'pending' }
    habit
  end

  factory :habit_event_params, class: Hash do
    initialize_with { attributes }

    status { 'done' }
    acted_at { Time.current }
  end
end
