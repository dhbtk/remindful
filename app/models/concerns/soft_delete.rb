# frozen_string_literal: true

module SoftDelete
  extend ActiveSupport::Concern

  def soft_delete
    return true if deleted_at.present?

    update(deleted_at: Time.current)
  end
end
