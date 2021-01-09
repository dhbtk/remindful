class CreateWaterGlasses < ActiveRecord::Migration[6.1]
  def change
    create_table :water_glasses do |t|
      t.references :user, null: false, foreign_key: true
      t.date :day, null: false
      t.timestamp :drank_at, null: false

      t.timestamps
    end
  end
end
