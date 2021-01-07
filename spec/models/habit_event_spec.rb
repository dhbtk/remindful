require 'rails_helper'

RSpec.describe HabitEvent, type: :model do
  describe '#recreate_pending' do
    let(:today) { Date.new(2021, 1, 7) }
    context 'when the source event is the original' do
      let(:habit_event) { create(:habit_event) }
      subject { habit_event.recreate_pending(today) }

      it { is_expected.to have_attributes(original_date: Date.new(2021, 1, 6), event_date: today) }
    end

    context 'when the source event has been recreated' do
      let(:habit_event) { create(:habit_event, original_date: Date.new(2021, 1, 5)) }
      subject { habit_event.recreate_pending(today) }

      it { expect(subject.errors.full_messages).to be_blank }
      it { is_expected.to have_attributes(original_date: Date.new(2021, 1, 5), event_date: today) }
    end
  end
end
