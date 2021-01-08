# frozen_string_literal: true

module SoftDelete
  extend ActiveSupport::Concern

  included do |base|
    base.scope :not_deleted, -> { where(deleted_at: nil) }
  end

  def soft_delete
    return true if deleted_at.present?

    update(deleted_at: Time.current)
  end
end
