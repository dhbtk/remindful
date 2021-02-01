import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import logo from '../logo.svg'
import { Container } from '@material-ui/core'

const useStyles = makeStyles((theme) => createStyles({
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logo: {
    maxWidth: '100%',
    margin: theme.spacing(1)
  }
}))

export default function RootLayout ({ children }: { children: React.ReactNode }): React.ReactElement {
  const classes = useStyles()
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <img className={classes.logo} src={logo} alt="Remindful"/>
        {children}
      </div>
    </Container>
  )
}
