import React, { useEffect, useMemo, useState } from 'react'
import LayoutContent from '../../layout/DrawerLayout/LayoutContent'
import { FormattedMessage, useIntl } from 'react-intl'
import LayoutContainer from '../../layout/DrawerLayout/LayoutContainer'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store/rootReducer'
import { Habit, Task } from '../../../store/common'
import {
  Box,
  Divider,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Toolbar,
  Typography
} from '@material-ui/core'
import HabitRepeatInterval from '../HabitListPage/HabitRepeatInterval'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import linkRef from '../../App/linkRef'
import EditIcon from '@material-ui/icons/Edit'
import { useAppDispatch } from '../../../store'
import { loadHabitTasks } from '../../../store/commonActions'
import { ymdToDate } from '../../ymdUtils'
import DoneIcon from '@material-ui/icons/Done'
import ClearIcon from '@material-ui/icons/Clear'

const useStyles = makeStyles((theme: Theme) => createStyles({
  title: {
    flexGrow: 1,
    marginLeft: '36px'
  }
}))

export default function HabitPage (): React.ReactElement {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const habitId = parseInt(useParams<{ habitId: string }>().habitId, 10)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    dispatch(loadHabitTasks(habitId)).then(() => setLoading(false), () => setLoading(false))
  }, [dispatch, habitId])
  const habit = useSelector<RootState, Habit>(state => state.habits.entities[habitId])
  const tasks = useSelector<RootState, Task[]>(state => {
    const tasks = Object.values(state.tasks.entities).filter(task => task.habitId === habitId)
    tasks.sort((a, b) => ymdToDate(b.eventDate).getTime() - ymdToDate(a.eventDate).getTime())
    return tasks
  })
  const EditLink = useMemo(() => linkRef(`/habits/${habitId}/edit`), [linkRef, habitId])
  const intl = useIntl()
  const secondaryToolbar = (
    <Toolbar variant="dense">
      <Typography component="h2" variant="h6" color="inherit" noWrap className={classes.title}>
        {habit.name}
      </Typography>
      <IconButton
        color="inherit"
        aria-label="edit"
        edge="end"
        component={EditLink}>
        <EditIcon/>
      </IconButton>
    </Toolbar>
  )
  return (
    <LayoutContent title={<FormattedMessage id="HabitsPage.title"/>} parentLink="/habits" secondaryToolbar={secondaryToolbar}>
      <LayoutContainer noPadding maxWidth="md">
        <Box p={3}>
          <Typography variant="subtitle1" component="span">
            <HabitRepeatInterval habit={habit}/>
          </Typography>
        </Box>
        <Divider/>
        <LinearProgress style={loading ? {} : { visibility: 'hidden' }}/>
        <List>
          {tasks.map(task => (
            <ListItem key={task.id}>
              <ListItemIcon>
                {task.status === 'done' ? <DoneIcon/> : <ClearIcon/>}
              </ListItemIcon>
              <ListItemText
                primary={intl.formatDate(ymdToDate(task.eventDate), { month: 'short', day: 'numeric', year: 'numeric', weekday: 'long' })}
              />
            </ListItem>
          ))}
        </List>
      </LayoutContainer>
    </LayoutContent>
  )
}
