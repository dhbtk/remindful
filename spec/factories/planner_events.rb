# frozen_string_literal: true

FactoryBot.define do
  factory :planner_event do
    planner { nil }
    original_date { '2021-01-08' }
    content { 'MyText' }
    status { 'MyString' }
    acted_at { '2021-01-08 11:04:26' }
  end
end
