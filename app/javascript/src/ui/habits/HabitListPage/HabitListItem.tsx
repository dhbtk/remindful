import React from 'react'
import { ListItem, ListItemText } from '@material-ui/core'
import HabitRepeatInterval from './HabitRepeatInterval'
import linkRef from '../../App/linkRef'
import { Habit } from '../../../models/habits'

const HabitListItem: React.FC<{ habit: Habit }> = ({ habit }) => {
  const CustomLink = React.useMemo(
    () => linkRef(`/habits/${habit.id}`),
    [habit, linkRef]
  )
  return (
    <ListItem button component={CustomLink}>
      <ListItemText
        primary={habit.name}
        secondary={<HabitRepeatInterval habit={habit}/>}
      />
    </ListItem>
  )
}

export default HabitListItem
