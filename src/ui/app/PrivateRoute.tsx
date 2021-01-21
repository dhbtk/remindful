import { useAuth } from '../../store/auth'
import { Route, RouteProps, Redirect } from 'react-router-dom'
import React from 'react'

export function PrivateRoute ({ children, ...rest }: RouteProps): React.ReactElement {
  const auth = useAuth()
  return (
    <Route {...rest} render={({ location }) => (
      auth.isAuthenticated() ? children : <Redirect to={{ pathname: '/welcome', state: { from: location } }}/>
    )}/>
  )
}
