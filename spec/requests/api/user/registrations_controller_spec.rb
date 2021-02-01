# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::User::RegistrationsController do
  describe '#create' do
    context 'when creation is successful' do
      let(:user) { create(:light_user) }
      let(:params) { build(:user_registration_params, :no_user) }

      before do
        post api_user_path(registration_form: params), headers: user_authorization
      end

      it { expect(response).to have_http_status(:ok) }

      it 'sends an welcome email' do
        expect(ActionMailer::MailDeliveryJob).to(
          have_been_enqueued.with(
            'UserMailer', 'welcome_email', 'deliver_now', hash_including(params: hash_including(:user))
          )
        )
      end
    end

    context 'when the email address is not unique' do
      let(:email) { Faker::Internet.email }
      let(:user) { create(:light_user) }
      let(:params) { build(:user_registration_params, :no_user, email: email) }

      before do
        create(:user, email: email)
        post api_user_path(registration_form: params), headers: user_authorization
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }

      it 'shows the appropriate error message' do
        expect(response).to include_json(errors: [{ attribute: 'email', type: 'uniqueness', options: {} }])
      end
    end
  end
end
