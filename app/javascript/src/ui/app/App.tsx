import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import DailyPage from '../daily/DailyPage'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { PrivateRoute } from './PrivateRoute'
import WelcomePage from '../welcome/WelcomePage'
import LocaleProvider from './LocaleProvider'
import { useAppDispatch } from '../../store'
import React, { useEffect } from 'react'
import { setAndLoadToday } from '../../store/daily'
import Notifier from './Notifier'
import { SnackbarProvider } from 'notistack'
import WeeklyPage from '../weekly/WeeklyPage'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'

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
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)

  return (
    <LocaleProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <SnackbarProvider>
          <Notifier />
          <BrowserRouter basename="/web_app">
            <Switch>
              <PrivateRoute exact path="/">
                <Redirect to="/today"/>
              </PrivateRoute>
              <PrivateRoute exact path="/today">
                <Redirect to={`/daily/${todayDate}`} />
              </PrivateRoute>
              <PrivateRoute exact path="/daily/:date">
                <DailyPage/>
              </PrivateRoute>
              <PrivateRoute exact path={['/weekly', '/weekly/:weekDate']}>
                <WeeklyPage/>
              </PrivateRoute>
              <Route path="/welcome">
                <WelcomePage/>
              </Route>
              <Route path="*">
                <Redirect to="/"/>
              </Route>
            </Switch>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </LocaleProvider>
  )
}

export default App
