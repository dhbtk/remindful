import {makeStyles} from "@material-ui/core/styles";
import {Redirect, useLocation} from 'react-router-dom'
import {Button, Container, Grid, Link, TextField, Typography} from "@material-ui/core";
import logo from '../logo.svg'
import {useAuth} from "../../store/auth";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/rootReducer";
import {registerLightUser} from "../../store/user";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  startNow: {
    margin: theme.spacing(3, 0, 2)
  }
}))

export default function WelcomePage() {
  const classes = useStyles()
  const {from} = useLocation().state as any
  const auth = useAuth()
  const dispatch = useDispatch()
  const userStatus = useSelector<RootState>(state => state.user.status)

  if (auth.isAuthenticated()) {
    return <Redirect to={from}/>
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <img src={logo} alt="Remindful"/>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Button disabled={userStatus === 'loading'} type="button" fullWidth variant="outlined" color="primary"
                onClick={() => dispatch(registerLightUser())}
                className={classes.startNow}>
          {"Start Now"}
        </Button>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  )
}
