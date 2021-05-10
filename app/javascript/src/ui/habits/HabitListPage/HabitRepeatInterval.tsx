import { Habit, weekdayOptions } from '../../../store/common'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ymdToDate } from '../../ymdUtils'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => createStyles({
  active: {},
  inactive: {
    visibility: 'hidden'
  }
}))

const HabitRepeatInterval: React.FC<{ habit: Habit }> = ({ habit }) => {
  const classes = useStyles()
  if (habit.repeatIntervalUnit === 'weekday') {
    return (
      <React.Fragment>
        {weekdayOptions.map(day => (
          <span key={day} className={habit[day] ? classes.active : classes.inactive}>
            <FormattedMessage id={`HabitForm.${day}.abbr`}/>
          </span>
        ))}
      </React.Fragment>
    )
  }
  return (
    <FormattedMessage
      id={`HabitListPage.repeatInterval.${habit.repeatIntervalUnit}`}
      values={{ interval: habit.repeatInterval, startDate: ymdToDate(habit.startDate) }}
    />
  )
}

export default HabitRepeatInterval
