# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: 'Remindful <remindful@remindful.dhbtk.com>'
  layout 'mailer'
  helper :mail
end
