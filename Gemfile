# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.0.0'

gem 'bootsnap', '>= 1.4.4', require: false
gem 'devise'
gem 'doorkeeper'
gem 'jbuilder', '~> 2.7'
gem 'lograge'
gem 'pg', '~> 1.1'
gem 'premailer-rails'
gem 'puma', '~> 5.0'
gem 'pundit'
gem 'rack-cors'
gem 'rails', '~> 6.1.0'
gem 'rails_admin', '~> 2.0'
gem 'redis'
gem 'redis-namespace', '~> 1.8.0', github: 'resque/redis-namespace'
gem 'rexml'
gem 'sass-rails', '>= 6'
gem 'sidekiq'
gem 'sidekiq_alive'
gem 'sidekiq-cron'
gem 'turbolinks', '~> 5'
gem 'webpacker', '~> 5.0'
gem 'webrick'
gem 'with_advisory_lock'

group :development, :test do
  gem 'dotenv-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'overcommit'
  gem 'pry-rails'
  gem 'rails-controller-testing'
  gem 'rspec_junit_formatter'
  gem 'rspec-rails'
  gem 'rubocop'
  gem 'rubocop-rails', require: false
  gem 'rubocop-rspec', require: false
  gem 'simplecov'
end

group :development do
  gem 'listen', '~> 3.3'
  gem 'rack-mini-profiler', '~> 2.0'
  gem 'spring'
  gem 'web-console', '>= 4.1.0'
end

group :test do
  gem 'capybara', '>= 3.26'
  gem 'selenium-webdriver'
  gem 'webdrivers'
end
