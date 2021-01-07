class AddDeletedAtToHabits < ActiveRecord::Migration[6.1]
  def change
    add_column :habits, :deleted_at, :timestamp
  end
end
