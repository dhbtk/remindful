# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::HabitsController do
  let(:user) { create(:user) }

  describe '#index' do
    context 'when a user is logged in' do
      before { get api_habits_path, headers: user_authorization }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:index) }
    end

    context 'when a user is not logged in' do
      before { get api_habits_path }

      it { expect(response).to have_http_status(:unauthorized) }
    end
  end

  describe '#create' do
    before { allow(user).to receive(:update_current_events) }

    context 'when all required params are present' do
      before { post api_habits_path(habit: build(:habit_params)), headers: user_authorization }

      it { expect(user).to have_received(:update_current_events) }
      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:show) }
    end

    context 'when required params are missing' do
      before { post api_habits_path(habit: { name: '' }), headers: user_authorization }

      it { expect(response).to have_http_status(:unprocessable_entity) }
    end
  end

  describe '#show' do
    context 'when the habit exists' do
      let(:habit) { create(:habit, user: user) }

      before { get api_habit_path(habit), headers: user_authorization }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:show) }
    end

    context 'when the habit belongs to someone else' do
      let(:habit) { create(:habit) }

      before { get api_habit_path(habit), headers: user_authorization }

      it { expect(response).to have_http_status(:not_found) }
    end

    context 'when the habit has been soft-deleted' do
      let(:habit) { create(:habit, :soft_deleted, user: user) }

      before { get api_habit_path(habit), headers: user_authorization }

      it { expect(response).to have_http_status(:not_found) }
    end

    context 'when the habit does not exist' do
      before { get api_habit_path(4040), headers: user_authorization }

      it { expect(response).to have_http_status(:not_found) }
    end
  end

  describe '#update' do
    before { allow(user).to receive(:update_current_events) }

    context 'when all required params are present' do
      let(:habit) { create(:habit, user: user) }

      before { patch api_habit_path(habit, habit: build(:habit_params)), headers: user_authorization }

      it { expect(user).to have_received(:update_current_events) }
      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:show) }
    end

    context 'when required params are missing' do
      let(:habit) { create(:habit, user: user) }

      before { patch api_habit_path(habit, habit: { notify: true }), headers: user_authorization }

      it { expect(response).to have_http_status(:unprocessable_entity) }
    end
  end

  describe '#destroy' do
    let(:habit) { create(:habit, user: user) }

    before do
      allow(user).to receive(:update_current_events)
      delete api_habit_path(habit), headers: user_authorization
    end

    it { expect(user).to have_received(:update_current_events) }
    it { expect(response).to have_http_status(:no_content) }
  end
end
