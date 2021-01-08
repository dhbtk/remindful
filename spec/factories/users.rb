# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    username { SecureRandom.uuid }
    email { Faker::Internet.email }
    password { SecureRandom.hex(6) }
    password_confirmation { password }

    factory :light_user do
      email { "#{username}@#{username}" }
      anonymous { true }
    end
  end
end
