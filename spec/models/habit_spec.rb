require 'rails_helper'

RSpec.describe Habit, type: :model do
  let(:today) { Date.new(2021, 1, 7) }

  describe '#visible_at' do
    let(:habit) { build(:habit) }
    subject { habit.visible_at(today) }

    context 'when it repeats every day' do
      it { is_expected.to be true }
    end

    context 'when it repeats every three days' do
      let(:habit) { build(:habit, repeat_interval: 3) }

      context 'and it should appear today' do
        let(:today) { Date.new(2021, 1, 9) }

        it { is_expected.to be true }
      end

      context 'and it should not appear today' do
        it { is_expected.to be false }
      end
    end

    context 'when it repeats every week' do
      let(:habit) { build(:habit, repeat_interval: 1, repeat_interval_unit: 'week') }

      context 'and it should appear today' do
        let(:today) { Date.new(2021, 1, 13) }

        it { is_expected.to be true }
      end

      context 'and it should not appear today' do
        it { is_expected.to be false }
      end
    end

    context 'when it repeats every month' do
      let(:habit) { build(:habit, repeat_interval: 1, repeat_interval_unit: 'month') }

      context 'and it should appear today' do
        let(:today) { Date.new(2021, 2, 6) }

        it { is_expected.to be true }
      end

      context 'and it should not appear today' do
        it { is_expected.to be false }
      end
    end
  end
end
