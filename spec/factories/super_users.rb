# frozen_string_literal: true

FactoryBot.define do
  factory :super_user do
    email { Faker::Internet.email }
    password { SecureRandom.hex(6) }
    password_confirmation { password }
  end
end
