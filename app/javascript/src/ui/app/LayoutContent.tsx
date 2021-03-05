import React, { MouseEventHandler, useMemo, useState } from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import { AppBar, Avatar, Menu, MenuItem, Theme } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { useAppDispatch } from '../../store'
import { toggleDrawer } from '../../store/layout'
import { drawerWidth } from './DrawerLayout'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { clearUserInfo, UserInfo } from '../../store/user'
import linkRef from './linkRef'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

interface Props {
  title: React.ReactNode
  actions?: React.ReactNode
  parentLink?: string
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
      flexDirection: 'column',
      position: 'relative',
      '& .MuiFab-root': {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2)
      }
    },
    avatar: {
      width: theme.spacing(4),
      height: theme.spacing(4)
    }
  })
)

export default function LayoutContent ({ title, actions, children, parentLink }: Props): React.ReactElement {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const toggleDrawerAction = (): void => { dispatch(toggleDrawer()) }
  const user = useSelector<RootState, UserInfo>(state => state.user.user)
  const signOut = (): void => { dispatch(clearUserInfo()) }
  const [anchorElement, setAnchorElement] = useState<Element | null>(null)

  const openMenu: MouseEventHandler = e => setAnchorElement(e.currentTarget)
  const closeMenu = (): void => setAnchorElement(null)
  const ParentLink = useMemo(() => linkRef(parentLink ?? ''), [linkRef, parentLink])

  const userButton = user.anonymous ? [] : (
    <IconButton
      aria-controls="profile-menu"
      aria-haspopup="true"
      size="small"
      onClick={openMenu}
      edge="end">
      <Avatar alt="user avatar" src={user.avatarUrl} className={classes.avatar}/>
    </IconButton>
  )

  return (
    <React.Fragment>
      <Menu
        id="profile-menu"
        open={Boolean(anchorElement)}
        anchorEl={anchorElement}
        keepMounted
        onClose={closeMenu}>
        <MenuItem onClick={closeMenu}>Profile</MenuItem>
        <MenuItem onClick={() => {
          signOut()
          closeMenu()
        }}>Sign Out</MenuItem>
      </Menu>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar variant="dense">
          {(parentLink === undefined ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawerAction}
              className={classes.menuButton}
            >
              <MenuIcon/>
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="back"
              edge="start"
              component={ParentLink}>
              <ArrowBackIcon/>
            </IconButton>
          ))}
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            {title}
          </Typography>
          {actions}
          {userButton}
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        {children}
      </main>
    </React.Fragment>
  )
}
