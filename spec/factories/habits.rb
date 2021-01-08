# frozen_string_literal: true

FactoryBot.define do
  factory :habit do
    name { Faker::Hipster.sentence }
    repeat_interval { 1 }
    repeat_interval_unit { 'day' }
    start_date { Date.new(2021, 1, 6) }
    notify { false }
    user
  end
end
