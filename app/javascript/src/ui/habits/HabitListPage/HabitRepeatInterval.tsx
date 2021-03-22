import { Habit, weekdayOptions } from '../../../store/common'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { ymdToDate } from '../../ymdUtils'

const HabitRepeatInterval: React.FC<{ habit: Habit }> = ({ habit }) => {
  if (habit.repeatIntervalUnit === 'weekday') {
    return (
      <React.Fragment>
        {weekdayOptions.map(day => (
          <span key={day}>
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
