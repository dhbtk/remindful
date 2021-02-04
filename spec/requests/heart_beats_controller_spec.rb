# frozen_string_literal: true

require 'rails_helper'

RSpec.describe HeartBeatsController do
  describe '#show' do
    before { get heart_beat_path }

    it { expect(response).to have_http_status(:ok) }
  end
end
