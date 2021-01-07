require 'rails_helper'

RSpec.describe User, type: :model do
  describe '#create_habit_events' do
    let(:today) { Date.new(2021, 1, 7) }
    subject { create(:user) }
    context 'when a repeating habit is overdue' do
      let(:habit) { create(:habit, user: subject, start_date: today.prev_day) }
      let!(:habit_event) { create(:habit_event, habit: habit, event_date: today.prev_day) }
      before { subject.create_habit_events(today) }

      it 'creates a new HabitEvent with the original_date' do
        expect(HabitEvent.find_by(habit: habit, event_date: today)).to have_attributes(original_date: today.prev_day)
      end
    end

    context 'when a new habit is added' do
      let!(:habit) { create(:habit, user: subject, start_date: today) }
      before { subject.create_habit_events(today) }

      it 'creates a HabitEvent' do
        expect(HabitEvent.find_by(habit: habit, event_date: today)).to be_present
      end
    end

    context 'when many habits are added' do
      before do
        create_list(:habit, 5, user: subject, start_date: today)
        create_list(:habit, 3, user: subject, repeat_interval: 3, start_date: today - 3.days)
        create_list(:habit, 2, user: subject, repeat_interval_unit: 'week', start_date: today - 1.week)
        create_list(:habit, 3, user: subject, repeat_interval_unit: 'month', start_date: today - 1.month)
      end

      it 'creates the HabitEvents' do
        expect(subject.habits.count).not_to be_zero
        expect { subject.create_habit_events(today) }.to(
          change { subject.habit_events.count }.by(subject.habits.count)
        )
      end
    end
  end
end
