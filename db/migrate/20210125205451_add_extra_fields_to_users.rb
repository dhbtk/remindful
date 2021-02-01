class AddExtraFieldsToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :name, :string, null: false, default: ''
    add_column :users, :avatar_url, :string, null: false, default: ''
    add_column :users, :pronouns, :string, null: false, default: 'neutral'
  end
end
