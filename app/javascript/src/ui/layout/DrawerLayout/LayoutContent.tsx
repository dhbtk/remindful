import React, { MouseEventHandler, useMemo, useState } from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import { AppBar, Avatar, Menu, MenuItem } from '@material-ui/core'
import { useAppDispatch } from '../../../store'
import { toggleDrawer } from '../../../store/common/layout'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/rootReducer'
import { UserInfo } from '../../../store/user/user'
import linkRef from '../../App/linkRef'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { resetState } from '../../../store/common/commonActions'
import { useStyles } from './styles'

interface Props {
  title: React.ReactNode
  actions?: React.ReactNode
  parentLink?: string
  children: React.ReactNode
  secondaryToolbar?: React.ReactNode
}

export default function LayoutContent ({ title, actions, children, parentLink, secondaryToolbar }: Props): React.ReactElement {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const toggleDrawerAction = (): void => { dispatch(toggleDrawer()) }
  const user = useSelector<RootState, UserInfo>(state => state.user.user)
  const signOut = (): void => { dispatch(resetState()) }
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
        {secondaryToolbar}
      </AppBar>
      <main className={classes.content}>
        <div className={classes.toolbar}/>
        {secondaryToolbar !== undefined && <div className={classes.toolbar}/>}
        {children}
      </main>
    </React.Fragment>
  )
}
