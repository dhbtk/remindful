# frozen_string_literal: true

json.extract! habit, :id, :name, :repeat_interval, :repeat_interval_unit, :start_date, :notify, :notification_time,
              :order, :repeat_sunday, :repeat_monday, :repeat_tuesday, :repeat_wednesday, :repeat_thursday,
              :repeat_friday, :repeat_saturday
