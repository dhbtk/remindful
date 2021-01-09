# frozen_string_literal: true

class WaterGlass < ApplicationRecord
  belongs_to :user

  def self.for_date(date)
    where(day: date).order(:drank_at)
  end
end
