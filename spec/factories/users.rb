FactoryBot.define do
  factory :user do
    username { SecureRandom.uuid }
    email { Faker::Internet.email }
    password { SecureRandom.hex(6) }
    password_confirmation { password }
  end
end
