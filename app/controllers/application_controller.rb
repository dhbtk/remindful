# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit

  def append_info_to_payload(payload)
    super
    payload[:host] = request.host
  end
end
