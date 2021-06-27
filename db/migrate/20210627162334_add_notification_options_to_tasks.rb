class AddNotificationOptionsToTasks < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :notify, :boolean, null: false, default: false
    add_column :tasks, :notification_time, :time
  end
end
