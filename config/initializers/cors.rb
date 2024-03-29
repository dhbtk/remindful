# frozen_string_literal: true

Rails.application.config.middleware.insert_before 0, Rack::Cors, debug: false, logger: (-> { Rails.logger }) do
  allow do
    origins '*'

    resource '/cors',
             headers: :any,
             methods: [:post],
             max_age: 0

    resource '*',
             headers: :any,
             methods: %i[get post delete put patch options head],
             max_age: 0
  end
end
