import { IntlProvider } from 'react-intl'
import React, { FunctionComponent } from 'react'
import en from '../../locale/en.json'
import ptBr from '../../locale/pt-BR.yml'
import enDateMap from 'date-fns/locale/en-US'
import ptBrDateMap from 'date-fns/locale/pt-BR'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

function flattenObject (sourceObject: any): Record<string, string> {
  const toReturn: Record<string, string> = {}
  Object.keys(sourceObject).forEach(key => {
    if (sourceObject[key] !== null && typeof sourceObject[key] === 'object') {
      const flatObject = flattenObject(sourceObject[key])
      Object.keys(flatObject).forEach(nestedKey => {
        toReturn[`${key}.${nestedKey}`] = flatObject[nestedKey]
      })
    } else {
      toReturn[key] = sourceObject[key]
    }
  })

  return toReturn
}

const messages = { en, 'pt-BR': flattenObject(ptBr) }
const dateMessages = {
  en: enDateMap,
  'pt-BR': ptBrDateMap
}
const locale = 'pt-BR'

const LocaleProvider: FunctionComponent = ({ children }) => {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={dateMessages[locale]}>
        {children}
      </MuiPickersUtilsProvider>
    </IntlProvider>
  )
}

export default LocaleProvider
