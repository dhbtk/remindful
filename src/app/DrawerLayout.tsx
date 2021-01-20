import { createStyles, makeStyles } from '@material-ui/core/styles'
import { AppBar, Divider, List, Theme } from '@material-ui/core'
import React from 'react'
import { useAppDispatch } from '../store'
import { useSelector } from 'react-redux'
import { RootState } from '../store/rootReducer'
import { toggleDrawer } from '../store/layout'
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

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex'
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
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    title: {
      flexGrow: 1
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
  const toggleDrawerAction: () => void = () => dispatch(toggleDrawer())

  const drawer = (
    <div>
      <div className={classes.toolbar}/>
      <Divider/>
      <List component="nav">
        <ListItemLink icon={<HomeIcon/>} primary={'Home'} to={'/today'}/>
        <ListItemLink icon={<ViewWeekIcon/>} primary={'My Week'} to={'/weekly'}/>
        <ListItemLink icon={<ScheduleIcon/>} primary={'Habits'} to={'/habits'}/>
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
