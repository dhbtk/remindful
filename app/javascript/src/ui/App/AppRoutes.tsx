import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import WelcomePage from '../welcome/WelcomePage'
import RegistrationPage from '../registration/RegistrationPage'
import { PrivateRoute } from './PrivateRoute'
import DrawerLayout from '../layout/DrawerLayout/DrawerLayout'
import TodayPage from '../today/TodayPage'
import DailyPage from '../daily/DailyPage'
import WeeklyPage from '../weekly/WeeklyPage'
import HabitListPage from '../habits/HabitListPage/HabitListPage'
import NewHabitPage from '../habits/NewHabitPage'
import HabitPage from '../habits/HabitPage'

export const AppRoutes: React.FC = () => {
  return (
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
                <HabitListPage/>
              </PrivateRoute>
              <PrivateRoute exact path="/habits/new">
                <NewHabitPage/>
              </PrivateRoute>
              <PrivateRoute exact path="/habits/:habitId">
                <HabitPage/>
              </PrivateRoute>
              <Route path="*">
                <Redirect to="/"/>
              </Route>
            </Switch>
          </DrawerLayout>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  )
}
