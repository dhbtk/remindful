class AddOrderToEvents < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :order, :integer
    add_column :habits, :order, :integer
    reversible do |dir|
      dir.up do
        execute 'UPDATE planner_events SET "order" = id'
        execute 'UPDATE habits SET "order" = id'
      end
    end
  end
end
