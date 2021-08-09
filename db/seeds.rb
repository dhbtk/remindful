Doorkeeper::Application.create(name: 'Web App',
                               uid: '8eI-VWlFrqAwaUHTpynIK9iuTJo9Hz0b40pxwjZwpEQ',
                               secret: 'Cu9z0g0sAPR1vRebVCzCweGmNR4JXF8gHtpMcmHNnek')
user = User.create(
  email: 'diana@dianahorbatiuk.com',
  username: SecureRandom.uuid,
  password: '12345678',
  password_confirmation: '12345678',
  name: 'Diana Horbatiuk',
  avatar_url: 'https://loremflickr.com/80/80'
)

super_user = SuperUser.create(
  email: 'diana@dianahorbatiuk.com',
  password: '12345678',
  password_confirmation: '12345678'
)

(5..12).to_a.sample.times do
  user.tasks.create(
    content: Faker::Hipster.sentence,
    status: 'pending',
    event_date: (1..12).to_a.sample.days.ago
  )
end

(5..12).to_a.sample.times do
  user.tasks.create(
    content: Faker::Hipster.sentence,
    status: 'pending',
    event_date: (0..12).to_a.sample.days.from_now
  )
end

(3..10).to_a.sample.times do
  user.habits.create(
    name: Faker::Marketing.buzzwords,
    repeat_interval_unit: %w[day week month].sample,
    repeat_interval: (1..3).to_a.sample,
    notify: true,
    start_date: Date.today,
    notification_time: Date.today.beginning_of_day + (0..23).to_a.sample.hours + (0..59).to_a.sample.minutes
  )
end

def boolean
  [0, 1].sample == 1
end

(5..8).to_a.sample.times do
  user.habits.create(
    name: Faker::Marketing.buzzwords,
    repeat_interval_unit: %w[business_day weekend weekday].sample,
    repeat_interval: 1,
    repeat_sunday: boolean,
    repeat_monday: boolean,
    repeat_tuesday: boolean,
    repeat_wednesday: boolean,
    repeat_thursday: boolean,
    repeat_friday: boolean,
    repeat_saturday: boolean,
    notify: true,
    start_date: Date.today,
    notification_time: Date.today.beginning_of_day + (0..23).to_a.sample.hours + (0..59).to_a.sample.minutes
  )
end

user.update_daily_tasks
