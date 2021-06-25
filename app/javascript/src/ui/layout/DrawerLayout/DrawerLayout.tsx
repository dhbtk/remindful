import React from 'react'
import { useAppDispatch } from '../../../store'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/rootReducer'
import { toggleDrawer } from '../../../store/common/layout'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import { useStyles } from './styles'
import { AppDrawer } from './AppDrawer'

interface Props {
  children: React.ReactNode
}

export default function DrawerLayout ({ children }: Props): React.ReactElement {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const drawerOpen = useSelector<RootState, boolean>(state => state.layout.drawerOpen)
  const toggleDrawerAction: () => void = () => dispatch(toggleDrawer())

  return (
    <div className={classes.root}>
      <nav className={classes.drawer} aria-label="navigation">
        <Hidden smUp>
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
            <AppDrawer/>
          </Drawer>
        </Hidden>
        <Hidden xsDown>
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            <AppDrawer/>
          </Drawer>
        </Hidden>
      </nav>
      {children}
    </div>
  )
}
