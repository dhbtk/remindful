import { useAuth } from '../../store/user/auth'
import { Route, RouteProps, Redirect } from 'react-router-dom'
import React from 'react'

export const PrivateRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const auth = useAuth()
  return (
    <Route {...rest} render={({ location }) => (
      auth.isAuthenticated() ? children : <Redirect to={{ pathname: '/welcome', state: { from: location } }}/>
    )}/>
  )
}
