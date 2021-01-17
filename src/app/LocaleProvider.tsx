import { IntlProvider } from 'react-intl'
import {FunctionComponent} from "react";

const LocaleProvider: FunctionComponent = ({ children }) => {
  return (
    <IntlProvider key={'en'} locale={'en'} messages={{}}>
      {children}
    </IntlProvider>
  )
}

export default LocaleProvider
