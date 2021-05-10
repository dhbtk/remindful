import React, { useMemo } from 'react'
import { useStyles } from './styles'
import clsx from 'clsx'
import logo from '../../logo.svg'
import { Button, Divider, List } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { FormattedMessage } from 'react-intl'
import ListItemLink from './ListItemLink'
import HomeIcon from '@material-ui/icons/Home'
import ViewWeekIcon from '@material-ui/icons/ViewWeek'
import ScheduleIcon from '@material-ui/icons/Schedule'
import linkRef from '../../App/linkRef'
import { useAppSelector } from '../../../store'

export const AppDrawer: React.FC = () => {
  const classes = useStyles()
  const todayDate = useAppSelector(state => state.daily.todayDate)
  const WelcomeLink = useMemo(() => linkRef('/welcome'), [linkRef])
  const RegisterLink = useMemo(() => linkRef('/registration'), [linkRef])
  const user = useAppSelector(state => state.user.user)

  return (
    <div>
      <div className={clsx(classes.toolbar, classes.drawerLogo)}>
        <img className={classes.logo} alt="Remindful" src={logo}/>
      </div>
      <Divider/>
      {user.anonymous && (
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
          icon={<HomeIcon/>} primary={<FormattedMessage id="TodayPage.title" defaultMessage="Today"/>}
          to="/"/>
        <ListItemLink
          icon={<ViewWeekIcon/>}
          primary={<FormattedMessage id="WeeklyPage.title" defaultMessage="My Week"/>}
          to={`/weekly/${todayDate}`}/>
        <ListItemLink
          icon={<ScheduleIcon/>} primary={<FormattedMessage id="HabitsPage.title" defaultMessage="Habits"/>}
          to={'/habits'}/>
      </List>
    </div>
  )
}
