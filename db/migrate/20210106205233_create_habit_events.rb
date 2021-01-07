class CreateHabitEvents < ActiveRecord::Migration[6.1]
  def change
    create_table :habit_events do |t|
      t.references :habit, null: false, foreign_key: true
      t.date :event_date
      t.string :status
      t.timestamp :acted_at

      t.timestamps
    end
  end
end
