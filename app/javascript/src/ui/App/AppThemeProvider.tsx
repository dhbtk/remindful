import React, { useMemo } from 'react'
import { createMuiTheme, useMediaQuery, ThemeProvider, CssBaseline } from '@material-ui/core'
import { themeColors } from './App'

export const AppThemeProvider: React.FC = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(() => createMuiTheme({
    palette: {
      primary: {
        main: themeColors.primary
      },
      secondary: {
        main: themeColors.secondary
      },
      type: prefersDarkMode ? 'dark' : 'light'
    }
  }), [prefersDarkMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      {children}
    </ThemeProvider>
  )
}
