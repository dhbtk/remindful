# frozen_string_literal: true

module Api
  module User
    class RegistrationsController < ApiController
      def create
        @user_registration = UserRegistration.new(user_registration_params)

        if @user_registration.save
          UserMailer.with(user: @user_registration.user).welcome_email.deliver_later
        else
          render 'api/shared/errors', locals: { object: @user_registration }, status: :unprocessable_entity
        end
      end

      def show; end

      private

      def user_registration_params
        permitted_params = params.require(:registration_form)
                                 .permit(:email, :name, :avatar_url, :password, :password_confirmation, :pronouns)
        { user: current_user }.merge(permitted_params)
      end
    end
  end
end
