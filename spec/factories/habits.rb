# frozen_string_literal: true

FactoryBot.define do
  factory :habit do
    name { Faker::Hipster.sentence }
    repeat_interval { 1 }
    repeat_interval_unit { 'day' }
    start_date { Date.new(2021, 1, 6) }
    notify { false }
    user

    trait :soft_deleted do
      deleted_at { Time.current }
    end
  end

  factory :habit_params, class: Hash do
    initialize_with { attributes }

    name { Faker::Hipster.sentence }
    repeat_interval { 5 }
    repeat_interval_unit { 'week' }
    start_date { Date.new(2021, 1, 8) }
    notify { true }
    notification_time { '08:00' }
  end
end
