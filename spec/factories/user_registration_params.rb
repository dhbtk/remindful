# frozen_string_literal: true

FactoryBot.define do
  factory :user_registration_params, class: Hash do
    initialize_with { attributes }

    user { create(:light_user) }
    email { Faker::Internet.email }
    name { Faker::Name.name }
    avatar_url { Faker::Internet.url }
    password { SecureRandom.hex(4) }
    password_confirmation { password }
    pronouns { %w[female male neutral].sample }

    trait :no_user do
      after(:build) do |hash|
        hash.delete(:user)
      end
    end
  end
end
