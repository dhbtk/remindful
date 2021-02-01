# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UserRegistration do
  describe '#save' do
    subject(:user_registration) { described_class.new(params) }

    context 'when all required params are present' do
      let(:params) { build(:user_registration_params) }

      before { user_registration.save }

      it { is_expected.to be_saved }
      it { expect(user_registration.user).not_to be_anonymous }
      it { expect(user_registration.user).to have_attributes(params.slice(:email, :name, :avatar_url, :pronouns)) }
    end

    context 'when the email address is not unique' do
      let(:email) { Faker::Internet.email }
      let(:params) { build(:user_registration_params, email: email) }

      before do
        create(:user, email: email)
        user_registration.save
      end

      it { is_expected.not_to be_saved }
      it { expect(user_registration.user).to be_anonymous }
      it { expect(user_registration.errors.where(:email, :uniqueness)).to be_present }
    end

    context 'when the user is already a full user' do
      let(:params) { build(:user_registration_params, user: create(:user)) }

      before { user_registration.save }

      it { is_expected.not_to be_saved }
      it { expect(user_registration.errors.where(:user, :not_anonymous)).to be_present }
    end

    context 'when the passwords do not match' do
      let(:params) { build(:user_registration_params, password_confirmation: '12345678') }

      before { user_registration.save }

      it { is_expected.not_to be_saved }
      it { expect(user_registration.errors.where(:password_confirmation, :does_not_match)).to be_present }
    end

    context 'when data is missing' do
      let(:params) { { user: create(:light_user) } }

      before { user_registration.save }

      it { is_expected.not_to be_saved }

      it 'adds errors to all missing fields', :aggregate_failures do
        expect(user_registration.errors.where(:email, :blank)).to be_present
        expect(user_registration.errors.where(:name, :blank)).to be_present
        expect(user_registration.errors.where(:avatar_url, :blank)).to be_present
        expect(user_registration.errors.where(:password, :blank)).to be_present
        expect(user_registration.errors.where(:password_confirmation, :blank)).to be_present
        expect(user_registration.errors.where(:pronouns, :blank)).to be_present
      end
    end
  end
end
