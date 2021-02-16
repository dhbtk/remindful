# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#update_current_events' do
    let(:user) { create(:user) }

    let(:today) { Date.new(2021, 1, 7) }

    context 'when a new habit is added' do
      let!(:habit) { create(:habit, user: user, start_date: today) }

      before { user.update_daily_tasks(today) }

      it 'creates a Task' do
        expect(Task.find_by(habit: habit, event_date: today)).to be_present
      end
    end

    context 'when many habits are added' do
      before do
        create_list(:habit, 5, user: user, start_date: today)
        create_list(:habit, 3, user: user, repeat_interval: 3, start_date: today - 3.days)
        create_list(:habit, 2, user: user, repeat_interval_unit: 'week', start_date: today - 1.week)
        create_list(:habit, 3, user: user, repeat_interval_unit: 'month', start_date: today - 1.month)
      end

      it { expect(user.habits.count).not_to be_zero }

      it 'creates the Tasks' do
        expect { user.update_daily_tasks(today) }.to(
          change { user.tasks.joins(:habit).count }.by(user.habits.count)
        )
      end
    end

    context 'when a habit repeat_interval changed' do
      let(:habit) { create(:habit, user: user, start_date: today.prev_day, repeat_interval: 2) }
      let!(:task) { create(:task, user: user, habit: habit, event_date: today) }

      before { user.update_daily_tasks(today) }

      it 'destroys the Task' do
        expect { task.reload }.to raise_exception(ActiveRecord::RecordNotFound)
      end
    end

    context 'when the habit has been deleted' do
      let(:habit) do
        create(:habit, user: user, start_date: today.prev_day, deleted_at: today.prev_day.beginning_of_day)
      end
      let!(:task) { create(:task, user: user, habit: habit, event_date: today) }

      before { user.update_daily_tasks(today) }

      it 'destroys the Task' do
        expect { task.reload }.to raise_exception(ActiveRecord::RecordNotFound)
      end
    end
  end
end
