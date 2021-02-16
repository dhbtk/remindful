import React from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import { AppBar, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useAppDispatch } from '../../store'
import { toggleDrawer } from '../../store/layout'
import { drawerWidth } from './DrawerLayout'

interface Props {
  title: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth
      }
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      }
    },
    title: {
      flexGrow: 1
    },
    toolbar: {
      minHeight: '48px'
    },
    content: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    }
  })
)

export default function LayoutContent ({ title, actions, children }: Props): React.ReactElement {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const toggleDrawerAction = (): void => dispatch(toggleDrawer())

  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawerAction}
            className={classes.menuButton}
          >
            <MenuIcon/>
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {title}
          </Typography>
          {actions}
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        {children}
      </main>
    </React.Fragment>
  )
}
