import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import DailyPage from '../ui/daily/DailyPage'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { PrivateRoute } from './PrivateRoute'
import WelcomePage from '../ui/welcome/WelcomePage'
import LocaleProvider from './LocaleProvider'
import { useAppDispatch } from '../store'
import React, { useEffect } from 'react'
import { setAndLoadToday } from '../store/daily'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8c82fc'
    },
    secondary: {
      main: '#ff9de2'
    }
  }
})

function App (): React.ReactElement {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setAndLoadToday(new Date()))
    const interval = setInterval(() => dispatch(setAndLoadToday(new Date())), 60000)
    return () => clearInterval(interval)
  }, [dispatch])
  return (
    <LocaleProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <BrowserRouter>
          <Switch>
            <PrivateRoute exact path="/">
              <Redirect to="/today"/>
            </PrivateRoute>
            <PrivateRoute exact path="/today">
              <DailyPage/>
            </PrivateRoute>
            <Route path="/welcome">
              <WelcomePage/>
            </Route>
            <Route path="*">
              <Redirect to="/"/>
            </Route>
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </LocaleProvider>
  )
}

export default App
