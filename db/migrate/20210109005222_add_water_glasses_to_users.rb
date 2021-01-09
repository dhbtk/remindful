class AddWaterGlassesToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :water_glasses_per_day, :integer, default: 8, null: false
  end
end
