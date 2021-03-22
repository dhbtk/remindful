import React, { useEffect, useMemo } from 'react'
import LayoutContent from '../../app/LayoutContent'
import { FormattedMessage } from 'react-intl'
import LayoutContainer from '../../app/LayoutContainer'
import { Fab, List } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import linkRef from '../../app/linkRef'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../store'
import { loadHabits } from '../../../store/commonActions'
import { RootState } from '../../../store/rootReducer'
import { Habit } from '../../../store/common'
import HabitListItem from './HabitListItem'

export default function HabitListPage (): React.ReactElement {
  const NewHabitLink = useMemo(() => linkRef('/habits/new'), [linkRef])
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    dispatch(loadHabits()).catch(console.error)
  }, [])
  const habits = useSelector<RootState, Habit[]>(state => state.habits.ids.map(id => state.habits.entities[id]))
  const isLoading = useSelector<RootState, boolean>(state => state.habits.status === 'loading')
  return (
    <LayoutContent title={<FormattedMessage id="HabitsPage.title"/>}>
      <LayoutContainer maxWidth="md">
        <List>
          {habits.map(habit => <HabitListItem habit={habit} />)}
        </List>
        <Fab color="primary" component={NewHabitLink} aria-label="add">
          <AddIcon/>
        </Fab>
      </LayoutContainer>
    </LayoutContent>
  )
}
