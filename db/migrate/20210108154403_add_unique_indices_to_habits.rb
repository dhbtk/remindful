class AddUniqueIndicesToHabits < ActiveRecord::Migration[6.1]
  def change
    add_index :habits, %i[name user_id], unique: true
  end
end
