# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    username { SecureRandom.uuid }
    email { Faker::Internet.email }
    name { Faker::Name.name }
    avatar_url { Faker::Internet.url }
    password { SecureRandom.hex(6) }
    password_confirmation { password }
  end

  factory :light_user, class: 'User' do
    username { SecureRandom.uuid }
    password { SecureRandom.hex(6) }
    password_confirmation { password }
    anonymous { true }
  end
end
