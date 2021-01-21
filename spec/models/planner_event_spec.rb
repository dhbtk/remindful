# frozen_string_literal: true

require 'rails_helper'

RSpec.describe PlannerEvent, type: :model do
  describe '.reorder' do
    let(:user) { create(:user) }
    let(:planner_events) { create_list(:planner_event, 5, user: user) }
    let(:id_list) { planner_events.map(&:id).shuffle }

    before { described_class.reorder(planner_events, id_list) }

    it 'sets the correct order for each element' do
      id_list.each_with_index do |id, index|
        event = described_class.find(id)
        expect(event.order).to eq(index)
      end
    end
  end
end
