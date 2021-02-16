# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::TasksController do
  let(:user) { create(:user) }

  describe '#index' do
    context 'when there already are tasks' do
      let!(:task) { create(:task, user: user) }

      before do
        get api_tasks_path(date: task.event_date), headers: user_authorization
      end

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:index) }
      it { expect(assigns(:tasks).to_a).to include(task) }
    end

    context 'when there are no tasks' do
      before do
        get api_tasks_path(date: Time.zone.today), headers: user_authorization
      end

      it { expect(response).to have_http_status(:ok) }
      it { expect(response).to render_template(:index) }
    end
  end

  describe '#reorder' do
    before do
      allow(Task).to receive(:reorder)
      post reorder_api_tasks_path(ids: %w[1 2 3 4 5]), headers: user_authorization
    end

    it { expect(Task).to have_received(:reorder).with(anything, [1, 2, 3, 4, 5]) }
    it { expect(response).to have_http_status(:no_content) }
  end

  describe '#create' do
    context 'when all fields are present' do
      before do
        post api_tasks_path(task: build(:task_params)),
             headers: user_authorization
      end

      it { expect(response).to have_http_status(:no_content) }
    end

    context 'when fields are missing' do
      before do
        post api_tasks_path(task: { status: 'done' }),
             headers: user_authorization
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }
    end
  end

  describe '#update' do
    context 'when required fields are present' do
      let(:task) { create(:task, user: user) }

      before do
        patch api_task_path(task, task: { status: 'done', acted_at: Time.current }),
              headers: user_authorization
      end

      it { expect(response).to have_http_status(:no_content) }
    end

    context 'when required fields are absent' do
      let(:task) { create(:task, user: user) }

      before do
        patch api_task_path(task, task: { status: 'done' }),
              headers: user_authorization
      end

      it { expect(response).to have_http_status(:unprocessable_entity) }
    end

    context 'when the event does not exist' do
      before do
        patch api_task_path(999, task: { status: 'done', acted_at: Time.current }),
              headers: user_authorization
      end

      it { expect(response).to have_http_status(:not_found) }
    end

    context 'when the event belongs to someone else' do
      let(:task) { create(:task) }

      before do
        patch api_task_path(task, task: { status: 'done', acted_at: Time.current }),
              headers: user_authorization
      end

      it { expect(response).to have_http_status(:not_found) }
    end
  end

  describe '#destroy' do
    let(:task) { create(:task, user: user) }

    before do
      delete api_task_path(task),
             headers: user_authorization
    end

    it { expect(response).to have_http_status(:no_content) }
  end
end
