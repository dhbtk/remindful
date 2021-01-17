import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom'
import TodayPage from '../ui/today/TodayPage'
import {createMuiTheme, CssBaseline, ThemeProvider} from '@material-ui/core'
import {PrivateRoute} from "./PrivateRoute";
import WelcomePage from "../ui/welcome/WelcomePage";
import LocaleProvider from "./LocaleProvider";

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

function App() {
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
              <TodayPage/>
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
