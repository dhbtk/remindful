class CreateHabits < ActiveRecord::Migration[6.1]
  def change
    create_table :habits do |t|
      t.string :name, null: false
      t.integer :repeat_interval, null: false
      t.string :repeat_interval_unit, null: false
      t.date :start_date, null: false
      t.boolean :notify, null: false
      t.time :notification_time
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
