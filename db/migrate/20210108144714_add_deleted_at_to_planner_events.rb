class AddDeletedAtToPlannerEvents < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :deleted_at, :timestamp
  end
end
