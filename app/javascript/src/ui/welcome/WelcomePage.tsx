import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Redirect, useLocation } from 'react-router-dom'
import { Button, Grid, Link } from '@material-ui/core'
import { useAuth } from '../../store/user/auth'
import { useDispatch } from 'react-redux'
import { registerLightUser, setAccessToken } from '../../store/user/user'
import React, { useState } from 'react'
import linkRef from '../App/linkRef'
import RootLayout from '../layout/RootLayout'
import { FormattedMessage } from 'react-intl'
import * as Yup from 'yup'
import { AnySchema } from 'yup'
import { useTranslator } from '../forms'
import userApi from '../../api/userApi'
import { FORM_ERROR } from 'final-form'
import { makeValidate, TextField } from 'mui-rff'
import { Alert } from '@material-ui/lab'
import { Form } from 'react-final-form'
import { isFetchError } from '../../api/fetchWrappers'
import { useAppDispatch, useAppSelector } from '../../store'
import { logIn } from '../../store/user/actions'

const useStyles = makeStyles((theme) => createStyles({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  startNow: {
    margin: theme.spacing(3, 0, 2)
  }
}))

interface SignInForm {
  email: string
  password: string
}

const initialValues: SignInForm = {
  email: '',
  password: ''
}

const schema = Yup.object().shape({
  email: Yup.string().trim().lowercase().email().required(),
  password: Yup.string().required()
}) as AnySchema<SignInForm>

const fieldLabel: (s: string) => React.ReactNode = (s) => (
  <FormattedMessage
    id={`SignInForm.${s}.label`}
    defaultMessage={s}/>
)

export default function WelcomePage (): React.ReactElement {
  const classes = useStyles()
  const location = useLocation<{ from: string } | undefined>()
  const auth = useAuth()
  const dispatch = useAppDispatch()
  const userStatus = useAppSelector(state => state.user.status)
  const [formActed, setFormActed] = useState(false)

  if (formActed && auth.isAuthenticated()) {
    return <Redirect to={location.state?.from ?? '/'}/>
  }
  const startNow: () => void = () => {
    setFormActed(true)
    if (!auth.isAuthenticated()) {
      dispatch(registerLightUser()).catch(() => setFormActed(false))
    }
  }
  const { translateServerErrors, translator } = useTranslator('SignInForm')

  async function onSubmit (values: SignInForm): Promise<any> {
    setFormActed(true)
    try {
      const response = await dispatch(logIn(values.email, values.password))
      if (response !== null) {
        return translateServerErrors(response)
      }
    } catch (e) {
      if (isFetchError(e) && e.response.status === 401) {
        return { [FORM_ERROR]: 'bubi' }
      }
      const err = e as Error
      return { [FORM_ERROR]: `${err.name} - ${err.message}` }
    }
  }

  return (
    <RootLayout>
      <Button
        disabled={userStatus === 'loading'} type="button" fullWidth variant="outlined" color="primary"
        onClick={startNow}
        className={classes.startNow}>
        <FormattedMessage id="WelcomePage.startNow" defaultMessage="Start Now"/>
      </Button>
      <Form
        onSubmit={onSubmit} initialValues={initialValues}
        validate={makeValidate(schema, translator)}
        render={({ handleSubmit, submitError }) => {
          return (
            <form onSubmit={handleSubmit} noValidate className={classes.form}>
              {submitError !== undefined && (
                <Alert severity="error">{submitError}</Alert>
              )}
              <TextField
                margin="normal" variant="outlined" label={fieldLabel('email')} name="email" type="email" autoFocus
                autoComplete="email"
                required/>
              <TextField
                margin="normal" variant="outlined" label={fieldLabel('password')} name="password"
                autoComplete="current-password"
                type="password" required/>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                <FormattedMessage id="WelcomePage.signIn" defaultMessage="Sign In"/>
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    <FormattedMessage id="WelcomePage.forgotPassword" defaultMessage="Forgot your password?"/>
                  </Link>
                </Grid>
                <Grid item>
                  <Link component={linkRef('/registration')} variant="body2">
                    <FormattedMessage id="WelcomePage.register" defaultMessage="Register"/>
                  </Link>
                </Grid>
              </Grid>
            </form>
          )
        }}/>
    </RootLayout>
  )
}
