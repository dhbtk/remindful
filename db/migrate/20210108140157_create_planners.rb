class CreatePlanners < ActiveRecord::Migration[6.1]
  def change
    create_table :planners do |t|
      t.references :user, null: false, foreign_key: true
      t.date :plan_date, null: false

      t.timestamps
    end
  end
end
