import React, { useMemo } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import logo from '../logo.svg'
import { AppBar, Container, IconButton, Toolbar } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import linkRef from './linkRef'

const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
  },
  container: {
    flexGrow: 1
  },
  paper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  logo: {
    maxWidth: '100%',
    margin: theme.spacing(1)
  },
  toolbar: theme.mixins.toolbar,
  title: {
    flexGrow: 1
  },
}))

export default function UnauthenticatedLayout ({ title, children }: { title: React.ReactNode, children: React.ReactNode }): React.ReactElement {
  const classes = useStyles()
  const RootLink = useMemo(() => linkRef('/'), [linkRef])
  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" component={RootLink}>
            <ArrowBackIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <div className={classes.toolbar} />
        <div className={classes.paper}>
          <img className={classes.logo} src={logo} alt="Remindful"/>
          {children}
        </div>
      </Container>
    </div>
  )
}
