# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::PlannerEventsController do
  let(:user) { create(:user) }

  describe '#index' do
    context 'when the planner already exists' do
      let(:planner) { create(:planner, user: user) }
      let!(:planner_event) { create(:planner_event, planner: planner) }

      before do
        get api_planner_planner_events_path(planner.plan_date), headers: user_authorization
      end

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:index) }
      it { expect(assigns(:planner_events).to_a).to include(planner_event) }
    end

    context 'when the planner does not exist yet' do
      before do
        get api_planner_planner_events_path(Time.zone.today), headers: user_authorization
      end

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:index) }
    end
  end

  describe '#create' do
    context 'when the planner already exists' do
      let(:planner) { create(:planner, user: user) }

      before do
        post api_planner_planner_events_path(planner.plan_date, planner_event: build(:planner_event_params)),
             headers: user_authorization
      end

      it { expect(response).to have_http_status(:ok) }
    end

    context 'when fields are missing' do
      let(:planner) { create(:planner, user: user) }

      before do
        post api_planner_planner_events_path(planner.plan_date, planner_event: { status: 'done' }),
             headers: user_authorization
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }
    end

    context 'when the planner does not exist yet' do
      before do
        post api_planner_planner_events_path(Time.zone.today, planner_event: build(:planner_event_params)),
             headers: user_authorization
      end

      it { expect(response).to have_http_status(:ok) }
    end
  end

  describe '#update' do
    context 'when required fields are present' do
      let(:planner) { create(:planner, user: user) }
      let(:planner_event) { create(:planner_event, planner: planner) }

      before do
        patch api_planner_event_path(planner_event, planner_event: { status: 'done', acted_at: Time.current }),
              headers: user_authorization
      end

      it { expect(response).to have_http_status(:ok) }
    end

    context 'when required fields are absent' do
      let(:planner) { create(:planner, user: user) }
      let(:planner_event) { create(:planner_event, planner: planner) }

      before do
        patch api_planner_event_path(planner_event, planner_event: { status: 'done' }),
              headers: user_authorization
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }
    end

    context 'when the event does not exist' do
      before do
        patch api_planner_event_path(999, planner_event: { status: 'done', acted_at: Time.current }),
              headers: user_authorization
      end

      it { expect(response).to have_http_status(:not_found) }
    end

    context 'when the event belongs to someone else' do
      let(:planner_event) { create(:planner_event) }

      before do
        patch api_planner_event_path(planner_event, planner_event: { status: 'done', acted_at: Time.current }),
              headers: user_authorization
      end

      it { expect(response).to have_http_status(:not_found) }
    end
  end

  describe '#destroy' do
    let(:planner) { create(:planner, user: user) }
    let(:planner_event) { create(:planner_event, planner: planner) }

    before do
      delete api_planner_event_path(planner_event),
             headers: user_authorization
    end

    it { expect(response).to have_http_status(:ok) }
  end
end
