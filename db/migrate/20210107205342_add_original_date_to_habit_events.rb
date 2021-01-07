class AddOriginalDateToHabitEvents < ActiveRecord::Migration[6.1]
  def change
    add_column :habit_events, :original_date, :date
  end
end
