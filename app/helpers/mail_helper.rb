# frozen_string_literal: true

module MailHelper
  def mail_greeting(&block)
    tag.tr(tag.td(capture(&block), class: 'greeting-td'))
  end

  def mail_block(&block)
    tag.tr(tag.td(capture(&block), class: 'content-td'))
  end

  def mail_cta(url, text)
    render(partial: 'shared/mail_cta', locals: { url: url, text: text })
  end
end
