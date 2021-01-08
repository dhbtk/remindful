# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#update_current_events' do
    let(:user) { create(:user) }

    let(:today) { Date.new(2021, 1, 7) }

    context 'when a repeating habit is overdue' do
      let(:habit) { create(:habit, user: user, start_date: today.prev_day) }

      before do
        create(:habit_event, habit: habit, event_date: today.prev_day)
        user.update_current_events(today)
      end

      it 'creates a new HabitEvent with the original_date' do
        expect(HabitEvent.find_by(habit: habit, event_date: today)).to have_attributes(original_date: today.prev_day)
      end
    end

    context 'when a new habit is added' do
      let!(:habit) { create(:habit, user: user, start_date: today) }

      before { user.update_current_events(today) }

      it 'creates a HabitEvent' do
        expect(HabitEvent.find_by(habit: habit, event_date: today)).to be_present
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

      it 'creates the HabitEvents' do
        expect { user.update_current_events(today) }.to(
          change { user.habit_events.count }.by(user.habits.count)
        )
      end
    end

    context 'when a habit repeat_interval changed' do
      let(:habit) { create(:habit, user: user, start_date: today.prev_day, repeat_interval: 2) }
      let!(:habit_event) { create(:habit_event, habit: habit, event_date: today) }

      before { user.update_current_events(today) }

      it 'destroys the HabitEvent' do
        expect { habit_event.reload }.to raise_exception(ActiveRecord::RecordNotFound)
      end
    end

    context 'when a habit repeat_interval changed but the event is a recreation of a pending habit' do
      let(:habit) { create(:habit, user: user, start_date: today.prev_day, repeat_interval: 2) }
      let!(:habit_event) { create(:habit_event, habit: habit, event_date: today, original_date: today.prev_day) }

      before { user.update_current_events(today) }

      it 'does not destroy the HabitEvent' do
        expect(habit_event.reload).to be_present
      end
    end

    context 'when the habit has been deleted' do
      let(:habit) do
        create(:habit, user: user, start_date: today.prev_day, deleted_at: today.prev_day.beginning_of_day)
      end
      let!(:habit_event) { create(:habit_event, habit: habit, event_date: today) }

      before { user.update_current_events(today) }

      it 'destroys the HabitEvent' do
        expect { habit_event.reload }.to raise_exception(ActiveRecord::RecordNotFound)
      end
    end
  end
end
