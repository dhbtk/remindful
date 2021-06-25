import React, { useEffect, useMemo } from 'react'
import LayoutContent from '../../layout/DrawerLayout/LayoutContent'
import { FormattedMessage } from 'react-intl'
import { Fab, LinearProgress, List, Theme } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import linkRef from '../../App/linkRef'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../store'
import { loadHabits } from '../../../store/common/commonActions'
import { RootState } from '../../../store/rootReducer'
import HabitListItem from './HabitListItem'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import LayoutContainer from '../../layout/DrawerLayout/LayoutContainer'
import { Habit } from '../../../models/habits'

const useStyles = makeStyles((theme: Theme) => createStyles({
  listContainer: {
    paddingTop: 0
  }
}))

export default function HabitListPage (): React.ReactElement {
  const classes = useStyles()
  const NewHabitLink = useMemo(() => linkRef('/habits/new'), [linkRef])
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(loadHabits()).catch(console.error)
  }, [])
  const habits = useSelector<RootState, Habit[]>(state => state.habits.ids.map(id => state.habits.entities[id]))
  const isLoading = useSelector<RootState, boolean>(state => state.habits.status === 'loading')
  return (
    <LayoutContent title={<FormattedMessage id="HabitsPage.title"/>}>
      <LayoutContainer noPadding className={classes.listContainer} maxWidth="md">
        <LinearProgress style={isLoading ? {} : { visibility: 'hidden' }} />
        <List>
          {habits.map(habit => <HabitListItem habit={habit} key={habit.id} />)}
        </List>
        <Fab color="primary" component={NewHabitLink} aria-label="add">
          <AddIcon/>
        </Fab>
      </LayoutContainer>
    </LayoutContent>
  )
}
