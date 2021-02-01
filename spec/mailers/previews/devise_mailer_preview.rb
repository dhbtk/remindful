# frozen_string_literal: true

class DeviseMailerPreview < ActionMailer::Preview
  def confirmation_instructions
    Devise::Mailer.confirmation_instructions(User.first || FactoryBot.create(:user), {})
  end

  def unlock_instructions
    Devise::Mailer.unlock_instructions(User.first || FactoryBot.create(:user), 'faketoken')
  end

  def reset_password_instructions
    Devise::Mailer.reset_password_instructions(User.first || FactoryBot.create(:user), 'faketoken')
  end
end
