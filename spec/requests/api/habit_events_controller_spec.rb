# frozen_string_literal: true

RSpec.describe Api::HabitEventsController do
  let(:user) { create(:user) }

  describe '#index' do
    context 'when a user is logged in' do
      before { get api_habit_events_path, headers: user_authorization }

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:index) }
    end

    context 'when a user is not logged in' do
      before { get api_habit_events_path }

      it { expect(response).to have_http_status(:unauthorized) }
    end
  end

  describe '#update' do
    let(:habit) { create(:habit, user: user) }
    let(:habit_event) { create(:habit_event, habit: habit) }

    context 'when all required params are present' do
      before do
        patch api_habit_event_path(habit_event, habit_event: build(:habit_event_params)), headers: user_authorization
      end

      it { expect(response).to have_http_status(:ok) }
    end

    context 'when required params are missing' do
      before do
        patch api_habit_event_path(habit_event, habit_event: { status: 'done' }), headers: user_authorization
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }
    end
  end
end
