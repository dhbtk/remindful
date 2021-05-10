import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core'

export const drawerWidth = 240

export const useStyles = makeStyles((theme: Theme) =>
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
    // necessary for content to be below App bar
    toolbar: {
      minHeight: '48px'
    },
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
