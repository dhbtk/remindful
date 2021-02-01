# frozen_string_literal: true

json.user do
  json.extract! user, :email, :name, :avatar_url, :anonymous, :pronouns
end
