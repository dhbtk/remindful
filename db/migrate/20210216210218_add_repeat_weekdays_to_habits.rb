class AddRepeatWeekdaysToHabits < ActiveRecord::Migration[6.1]
  def change
    add_column :habits, :repeat_sunday, :boolean, default: false
    add_column :habits, :repeat_monday, :boolean, default: false
    add_column :habits, :repeat_tuesday, :boolean, default: false
    add_column :habits, :repeat_wednesday, :boolean, default: false
    add_column :habits, :repeat_thursday, :boolean, default: false
    add_column :habits, :repeat_friday, :boolean, default: false
    add_column :habits, :repeat_saturday, :boolean, default: false
  end
end
