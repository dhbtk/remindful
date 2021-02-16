class RenamePlannerEventToTask < ActiveRecord::Migration[6.1]
  def change
    rename_table :planner_events, :tasks
    up_only do
      drop_table :habit_events, if_exists: true
    end
    add_reference :tasks, :habit, foreign_key: true
    remove_column :tasks, :original_date
  end
end
