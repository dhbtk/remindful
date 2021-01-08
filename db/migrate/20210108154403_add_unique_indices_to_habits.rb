class AddUniqueIndicesToHabits < ActiveRecord::Migration[6.1]
  def change
    add_index :habits, %i[name user_id], unique: true
    add_index :habit_events, %i[event_date habit_id], unique: true
  end
end
