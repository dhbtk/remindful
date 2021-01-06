require 'rails_helper'

RSpec.describe Api::LightUsersController do
  describe '#create' do
    context 'when a valid client_id is passed' do
      before do
        post api_light_user_path(client_id: create(:doorkeeper_application).uid)
      end

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:create) }

      it 'renders the expected fields' do
        expect(JSON.parse(response.body)).to include('username', 'access_token')
      end
    end

    context 'when no client_id is passed' do
      before do
        post api_light_user_path
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }
    end
  end
end