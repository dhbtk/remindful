# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Doorkeeper::TokensController do
  describe 'POST /oauth/token' do
    let(:params) do
      {
        grant_type: 'password',
        username: username,
        password: password,
        client_id: application.uid,
        client_secret: application.secret
      }
    end
    let(:application) { create(:doorkeeper_application) }
    let(:username) { user_data[:username] }
    let(:password) { user_data[:password] }

    context 'when creating a token for a light user' do
      let(:user_data) { attributes_for(:light_user) }

      before do
        User.create(user_data)
        post oauth_token_path(params)
      end

      it { expect(response).to have_http_status(:ok) }
    end

    context 'when creating a token for a regular user' do
      let(:user_data) { attributes_for(:user) }

      before do
        User.create(user_data)
        post oauth_token_path(params)
      end

      it { expect(response).to have_http_status(:ok) }
    end

    context 'when the credentials are bogus' do
      let(:username) { 'bogus' }
      let(:password) { 'bogus' }

      before { post oauth_token_path(params) }

      it { expect(response).not_to have_http_status(:ok) }
    end
  end
end
