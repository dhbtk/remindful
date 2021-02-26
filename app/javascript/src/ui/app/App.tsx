import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import DailyPage from '../daily/DailyPage'
import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core'
import { PrivateRoute } from './PrivateRoute'
import WelcomePage from '../welcome/WelcomePage'
import LocaleProvider from './LocaleProvider'
import { useAppDispatch } from '../../store'
import React, { useEffect } from 'react'
import { setAndLoadToday, setTodayDate } from '../../store/daily'
import Notifier from './Notifier'
import { SnackbarProvider } from 'notistack'
import WeeklyPage from '../weekly/WeeklyPage'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import RegistrationPage from '../registration/RegistrationPage'
import { useAuth } from '../../store/auth'
import { loadUserInfo } from '../../store/user'
import { loadOverdueTasks } from '../../store/commonActions'
import { ymd } from '../ymdUtils'
import TodayPage from '../today/TodayPage'
import DrawerLayout from './DrawerLayout'
import HabitsPage from '../habits/HabitsPage'

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
  const auth = useAuth()
  const isLoggedIn = auth.isAuthenticated()
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(setTodayDate(ymd(new Date())))
      const interval = setInterval(() => dispatch(setTodayDate(ymd(new Date()))), 60000)
      return () => clearInterval(interval)
    }
  }, [dispatch, isLoggedIn])
  const accessToken = useSelector<RootState, string | null>(state => state.user.accessToken)
  useEffect(() => {
    if (accessToken !== null) {
      dispatch(loadUserInfo())
    }
  }, [dispatch, accessToken])
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)
  useEffect(() => {
    dispatch(loadOverdueTasks()).catch(console.error)
  }, [dispatch, todayDate])

  return (
    <LocaleProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <SnackbarProvider>
          <Notifier />
          <BrowserRouter basename="/web_app">
            <Switch>
              <Route path="/welcome">
                <WelcomePage/>
              </Route>
              <Route path="/registration">
                <RegistrationPage/>
              </Route>
              <PrivateRoute path="*">
                <DrawerLayout>
                  <Switch>
                    <PrivateRoute exact path="/">
                      <TodayPage/>
                    </PrivateRoute>
                    <PrivateRoute exact path="/daily/:date">
                      <DailyPage/>
                    </PrivateRoute>
                    <PrivateRoute exact path={['/weekly', '/weekly/:weekDate']}>
                      <WeeklyPage/>
                    </PrivateRoute>
                    <PrivateRoute exact path="/habits">
                      <HabitsPage/>
                    </PrivateRoute>
                    <Route path="*">
                      <Redirect to="/"/>
                    </Route>
                  </Switch>
                </DrawerLayout>
              </PrivateRoute>
            </Switch>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </LocaleProvider>
  )
}

export default App
