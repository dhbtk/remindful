import {useAuth} from "../store/auth";
import {Route, RouteProps, Redirect} from "react-router-dom";

export function PrivateRoute({children, ...rest}: RouteProps) {
  const auth = useAuth()
  return (
    <Route {...rest} render={({location}) => (
      auth.isAuthenticated() ? children : <Redirect to={{pathname: "/welcome", state: {from: location}}}/>
    )}/>
  )
}
