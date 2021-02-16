class AddDeletedAtToPlannerEvents < ActiveRecord::Migration[6.1]
  def change
    add_column :planner_events, :deleted_at, :timestamp
  end
end
