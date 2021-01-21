import { IntlProvider } from 'react-intl'
import { FunctionComponent } from 'react'
import en from '../../locale/en.json'
import ptBr from '../../locale/pt-BR.json'

const messages = { en, 'pt-BR': ptBr }
const locale = 'pt-BR'

const LocaleProvider: FunctionComponent = ({ children }) => {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  )
}

export default LocaleProvider
