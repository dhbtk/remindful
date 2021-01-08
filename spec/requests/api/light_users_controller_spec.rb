# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::LightUsersController do
  describe '#create' do
    context 'when a valid client_id is passed' do
      before do
        post api_light_user_path(client_id: create(:doorkeeper_application).uid)
      end

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:create) }

      it { expect(response).to include_json(:username, :access_token) }
    end

    context 'when no client_id is passed' do
      before do
        post api_light_user_path
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }
    end
  end
end
