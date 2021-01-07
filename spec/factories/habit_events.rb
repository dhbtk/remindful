FactoryBot.define do
  factory :habit_event do
    event_date { Date.new(2021, 1, 6) }
    status { 'pending' }
    habit
  end
end
