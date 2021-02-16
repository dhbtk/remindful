# frozen_string_literal: true

FactoryBot.define do
  factory :task do
    user
    event_date { '2021-01-08' }
    content { Faker::Hipster.sentence }
    status { 'pending' }
    acted_at { nil }
  end

  factory :task_params, class: Hash do
    initialize_with { attributes }

    content { Faker::Hipster.sentence }
    status { 'pending' }
    event_date { '2021-01-08' }
  end
end
