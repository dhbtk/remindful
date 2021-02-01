import { createStyles, makeStyles } from '@material-ui/core/styles'
import { AppBar, Button, Divider, List, Theme } from '@material-ui/core'
import React, { useMemo } from 'react'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { toggleDrawer } from '../../store/layout'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ListItemLink from './ListItemLink'
import HomeIcon from '@material-ui/icons/Home'
import ViewWeekIcon from '@material-ui/icons/ViewWeek'
import ScheduleIcon from '@material-ui/icons/Schedule'
import clsx from 'clsx'
import logo from '../logo.svg'
import { useAuth } from '../../store/auth'
import { FormattedMessage } from 'react-intl'
import { lastMonday } from '../ymdUtils'
import { clearUserInfo } from '../../store/user'
import linkRef from './linkRef'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100vh'
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0
      }
    },
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
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth
    },
    drawerLogo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logo: {
      height: '40px',
      width: 'auto'
    },
    content: {
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      flexGrow: 1
    },
    anonymousUserInfo: {
      padding: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column'
    },
    anonymousHello: {
      marginBottom: theme.spacing(3)
    },
    anonymousActions: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  })
)

interface Props {
  title: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
}

export default function DrawerLayout ({ title, actions, children }: Props): React.ReactElement {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const drawerOpen = useSelector<RootState, boolean>(state => state.layout.drawerOpen)
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)
  const mondayDate = lastMonday(todayDate)
  const toggleDrawerAction: () => void = () => dispatch(toggleDrawer())
  const auth = useAuth()
  const WelcomeLink = useMemo(() => linkRef('/welcome'), [linkRef])
  const RegisterLink = useMemo(() => linkRef('/registration'), [linkRef])

  const drawer = (
    <div>
      <div className={clsx(classes.toolbar, classes.drawerLogo)}>
        <img className={classes.logo} alt="Remindful" src={logo}/>
      </div>
      <Divider/>
      {auth.isLightUser() && (
        <React.Fragment>
          <div className={classes.anonymousUserInfo}>
            <Typography className={classes.anonymousHello} variant="body2">
              <FormattedMessage id="DrawerLayout.welcomeAnonymous" defaultMessage="Hello, anonymous!"/>
            </Typography>
            <div className={classes.anonymousActions}>
              <Button variant="text" component={WelcomeLink}>
                <FormattedMessage id="DrawerLayout.signIn" defaultMessage="Sign In"/>
              </Button>
              <Button variant="text" component={RegisterLink}>
                <FormattedMessage id="DrawerLayout.register" defaultMessage="Register"/>
              </Button>
            </div>
          </div>
          <Divider/>
        </React.Fragment>
      )}
      <List component="nav">
        <ListItemLink
          icon={<HomeIcon/>} primary={<FormattedMessage id="HomePage.title" defaultMessage="Home"/>}
          to={`/daily/${todayDate}`}/>
        <ListItemLink
          icon={<ViewWeekIcon/>}
          primary={<FormattedMessage id="WeeklyPage.title" defaultMessage="My Week"/>}
          to={`/weekly/${mondayDate}`}/>
        <ListItemLink
          icon={<ScheduleIcon/>} primary={<FormattedMessage id="HabitsPage.title" defaultMessage="Habits"/>}
          to={'/habits'}/>
      </List>
    </div>
  )

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
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
      <nav className={classes.drawer} aria-label="navigation">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={toggleDrawerAction}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        {children}
      </main>
    </div>
  )
}