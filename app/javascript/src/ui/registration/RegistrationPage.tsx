import React, { useEffect, useMemo, useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { Redirect } from 'react-router-dom'
import { useAppDispatch } from '../../store'
import { registerLightUser, setUserInfo } from '../../store/user'
import { RegistrationFormState } from '../../store/registrationForm'
import { Form, FormSpy } from 'react-final-form'
import { Checkboxes, makeValidate, RadioData, Radios, TextField } from 'mui-rff'
import { Avatar, Button } from '@material-ui/core'
import { md5 } from 'pure-md5'
import useDebounce from '../useDebounce'
import * as Yup from 'yup'
import { FormattedMessage } from 'react-intl'
import { useTranslator } from '../forms'
import { FORM_ERROR } from 'final-form'
import userApi from '../../api/userApi'
import { Alert } from '@material-ui/lab'
import UnauthenticatedLayout from '../layout/UnauthenticatedLayout'
import { AnySchema } from 'yup'

const useStyles = makeStyles((theme) => createStyles({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  avatarContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  nameField: {
    flex: '1'
  },
  avatar: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  pronouns: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1.5)
  }
}))

const initialValues: RegistrationFormState = {
  email: '',
  name: '',
  avatarUrl: '',
  password: '',
  passwordConfirmation: '',
  pronouns: null,
  agreeToTerms: false
}

const schema = Yup.object().shape({
  email: Yup.string().trim().lowercase().email().required(),
  name: Yup.string().required(),
  password: Yup.string().min(8).required(),
  passwordConfirmation: Yup.string().required().oneOf([Yup.ref('password')]),
  agreeToTerms: Yup.boolean().oneOf([true]),
  avatarUrl: Yup.string(),
  pronouns: Yup.string()
}) as AnySchema<RegistrationFormState>

const gravatar: (email: string | null | undefined) => string = email => {
  if (email === null || email === undefined || email.trim() === '') {
    return ''
  }
  return `https://gravatar.com/avatar/${md5(email.trim().toLowerCase())}?d=identicon`
}

const fieldLabel: (s: string) => React.ReactNode = (s) => (
  <FormattedMessage
    id={`RegistrationForm.${s}.label`}
    defaultMessage={s}/>
)

export default function RegistrationPage (): React.ReactElement {
  const classes = useStyles()
  const userCreated = useSelector<RootState, boolean>(state => state.user.accessToken !== null)
  const isFullUser = useSelector<RootState, boolean>(state => !state.user.user.anonymous)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!userCreated) {
      dispatch(registerLightUser() as any)
    }
  }, [userCreated, dispatch])

  const [userEmail, setUserEmail] = useState('')
  const debouncedUserEmail = useDebounce(userEmail, 500)
  const debouncedAvatarUrl = useMemo(() => gravatar(debouncedUserEmail), [debouncedUserEmail])

  const pronounData: RadioData[] = [
    { label: fieldLabel('pronouns.female'), value: 'female' },
    { label: fieldLabel('pronouns.male'), value: 'male' },
    { label: fieldLabel('pronouns.neutral'), value: 'neutral' }
  ]

  const [formLoading, setFormLoading] = useState(false)
  const { translateServerErrors, translator } = useTranslator('RegistrationForm')

  async function onSubmit (values: RegistrationFormState): Promise<Record<string, string> | undefined> {
    const fullData: RegistrationFormState = { ...values, avatarUrl: debouncedAvatarUrl }
    if (formLoading) return
    setFormLoading(true)
    try {
      const response = await userApi.registerFullUser(fullData)
      setFormLoading(false)
      if ('errors' in response) {
        return translateServerErrors(response)
      } else {
        dispatch(setUserInfo(response))
      }
    } catch (e) {
      setFormLoading(false)
      const err = e as Error
      return { [FORM_ERROR]: `${err.name} - ${err.message}` }
    }
  }

  if (userCreated && isFullUser) {
    return <Redirect to="/"/>
  }
  return (
    <UnauthenticatedLayout title={<FormattedMessage id="RegistrationPage.signUpTitle" defaultMessage="Sign Up"/>}>
      <Form
        onSubmit={onSubmit} initialValues={initialValues}
        validate={makeValidate(schema, translator)}
        render={({ handleSubmit, submitError }) => {
          return (
            <form onSubmit={handleSubmit} noValidate className={classes.form}>
              {submitError !== undefined && (
                <Alert severity="error">{submitError}</Alert>
              )}
              <FormSpy onChange={({ values }) => setUserEmail(values.email)}/>
              <TextField
                margin="normal" variant="outlined" label={fieldLabel('email')} name="email" type="email"
                required/>
              <div className={classes.avatarContainer}>
                <TextField
                  margin="normal" variant="outlined" label={fieldLabel('name')} name="name" required
                  className={classes.nameField}/>
                <Avatar alt="Gravatar" src={debouncedAvatarUrl} className={classes.avatar}/>
              </div>
              <div className={classes.pronouns}>
                <Radios
                  label={fieldLabel('pronouns')}
                  name="pronouns" data={pronounData}/>
              </div>
              <TextField
                margin="normal" variant="outlined" label={fieldLabel('password')} name="password"
                type="password" required/>
              <TextField
                margin="normal" variant="outlined" label={fieldLabel('passwordConfirmation')}
                name="passwordConfirmation"
                type="password" required/>
              <div className={classes.pronouns}>
                <Checkboxes
                  name="agreeToTerms"
                  required={true}
                  data={{ label: fieldLabel('agreeToTerms'), value: true }}
                />
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={formLoading}
              >
                <FormattedMessage id="RegistrationPage.signUpAction" defaultMessage="Sign Up"/>
              </Button>
            </form>
          )
        }}/>
    </UnauthenticatedLayout>
  )
}
