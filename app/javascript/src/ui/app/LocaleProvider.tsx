import { IntlProvider } from 'react-intl'
import React, { FunctionComponent } from 'react'
import en from '../../locale/en.json'
import ptBr from '../../locale/pt-BR.yml'

function flattenObject (sourceObject: any): { [key: string]: string } {
  const toReturn = {}
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
const locale = 'pt-BR'

const LocaleProvider: FunctionComponent = ({ children }) => {
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </IntlProvider>
  )
}

export default LocaleProvider
