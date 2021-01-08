# frozen_string_literal: true

json.array! @habits, partial: 'habits/habit', as: :habit
