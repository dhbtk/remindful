# frozen_string_literal: true

json.array! @habits, partial: 'habit', as: :habit
