module MailHelper
  def mail_greeting(&block)
    tag.tr(tag.td(capture(&block), class: 'greeting-td'))
  end

  def mail_block(&block)
    tag.tr(tag.td(capture(&block), class: 'content-td'))
  end

  def mail_cta(url, text)
    tag.tr(
      tag.td(
        tag.table(
          tag.tr(
            tag.td(
              link_to(text, url, target: '_blank', class: 'btn cta'),
              class: 'cta-container'
            )
          ), class: 'container', role: 'presentation', cellspacing: '0', cellpadding: '0', border: '0', align: 'left'
        ), align: 'left', class: 'cta-td'
      )
    )
  end
end
