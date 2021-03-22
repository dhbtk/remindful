import { Habit } from '../../../store/common'
import React from 'react'
import { ListItem, ListItemText } from '@material-ui/core'
import HabitRepeatInterval from './HabitRepeatInterval'

const HabitListItem: React.FC<{ habit: Habit }> = ({ habit }) => {
  return (
    <ListItem>
      <ListItemText
        primary={habit.name}
        secondary={<HabitRepeatInterval habit={habit}/>}
      />
    </ListItem>
  )
}

export default HabitListItem
