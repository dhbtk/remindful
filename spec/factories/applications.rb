FactoryBot.define do
  factory :doorkeeper_application, class: 'Doorkeeper::Application' do
    name { 'Application' }
    redirect_uri { '' }
    scopes { '' }
  end
end