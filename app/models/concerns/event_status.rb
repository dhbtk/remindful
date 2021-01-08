# frozen_string_literal: true

module EventStatus
  extend ActiveSupport::Concern

  included do |base|
    base.enum status: {
      pending: 'pending',
      done: 'done',
      dismissed: 'dismissed'
    }

    base.validates :status, presence: true
    base.validates :acted_at, presence: true, unless: -> { pending? }
  end
end
