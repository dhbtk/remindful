import LocaleProvider from './LocaleProvider'
import React from 'react'
import Notifier from './Notifier'
import { SnackbarProvider } from 'notistack'
import { DayTimer } from './DayTimer'
import { UserInformationLoader } from './UserInformationLoader'
import { AppRoutes } from './AppRoutes'
import { AppThemeProvider } from './AppThemeProvider'

export const themeColors = {
  primary: '#8c82fc',
  secondary: '#ff9de2',
  divider: 'rgba(0, 0, 0, .12)'
}

const App: React.FC = () => (
  <LocaleProvider>
    <AppThemeProvider>
      <SnackbarProvider>
        <Notifier/>
        <DayTimer/>
        <UserInformationLoader/>
        <AppRoutes/>
      </SnackbarProvider>
    </AppThemeProvider>
  </LocaleProvider>
)

export default App
