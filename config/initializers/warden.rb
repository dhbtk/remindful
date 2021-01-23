# frozen_string_literal: true

require_relative '../../lib/doorkeeper_warden_strategy'

Warden::Strategies.add(:doorkeeper, DoorkeeperWardenStrategy)
