# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_06_27_162334) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "habits", force: :cascade do |t|
    t.string "name", null: false
    t.integer "repeat_interval", null: false
    t.string "repeat_interval_unit", null: false
    t.date "start_date", null: false
    t.boolean "notify", null: false
    t.time "notification_time"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "deleted_at"
    t.integer "order"
    t.boolean "repeat_sunday", default: false
    t.boolean "repeat_monday", default: false
    t.boolean "repeat_tuesday", default: false
    t.boolean "repeat_wednesday", default: false
    t.boolean "repeat_thursday", default: false
    t.boolean "repeat_friday", default: false
    t.boolean "repeat_saturday", default: false
    t.index ["name", "user_id"], name: "index_habits_on_name_and_user_id", unique: true
    t.index ["user_id"], name: "index_habits_on_user_id"
  end

  create_table "oauth_access_tokens", force: :cascade do |t|
    t.bigint "resource_owner_id"
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.string "refresh_token"
    t.integer "expires_in"
    t.datetime "revoked_at"
    t.datetime "created_at", null: false
    t.string "scopes"
    t.string "previous_refresh_token", default: "", null: false
    t.index ["application_id"], name: "index_oauth_access_tokens_on_application_id"
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true
    t.index ["resource_owner_id"], name: "index_oauth_access_tokens_on_resource_owner_id"
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true
  end

  create_table "oauth_applications", force: :cascade do |t|
    t.string "name", null: false
    t.string "uid", null: false
    t.string "secret", null: false
    t.text "redirect_uri"
    t.string "scopes", default: "", null: false
    t.boolean "confidential", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true
  end

  create_table "super_users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_super_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_super_users_on_reset_password_token", unique: true
  end

  create_table "tasks", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "event_date", null: false
    t.text "content", null: false
    t.string "status", null: false
    t.datetime "acted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "deleted_at"
    t.integer "order"
    t.bigint "habit_id"
    t.boolean "notify", default: false, null: false
    t.time "notification_time"
    t.index ["habit_id"], name: "index_tasks_on_habit_id"
    t.index ["user_id"], name: "index_tasks_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "username", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "anonymous", default: false, null: false
    t.integer "water_glasses_per_day", default: 8, null: false
    t.string "name", default: "", null: false
    t.string "avatar_url", default: "", null: false
    t.string "pronouns", default: "neutral", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "water_glasses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.date "day", null: false
    t.datetime "drank_at", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_water_glasses_on_user_id"
  end

  add_foreign_key "habits", "users"
  add_foreign_key "oauth_access_tokens", "oauth_applications", column: "application_id"
  add_foreign_key "oauth_access_tokens", "users", column: "resource_owner_id"
  add_foreign_key "tasks", "habits"
  add_foreign_key "tasks", "users"
  add_foreign_key "water_glasses", "users"
end
