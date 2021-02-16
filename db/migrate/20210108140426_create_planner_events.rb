class CreatePlannerEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :planner_events do |t|
      t.references :user, null: false, foreign_key: true
      t.date :event_date, null: false
      t.date :original_date
      t.text :content, null: false
      t.string :status, null: false
      t.timestamp :acted_at

      t.timestamps
    end
  end
end
