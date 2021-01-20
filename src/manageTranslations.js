const manageTranslations = require('react-intl-translations-manager').default

manageTranslations({
  messagesDirectory: 'build/messages/src/extracted/',
  translationsDirectory: 'locale/',
  languages: ['en', 'pt']
})
