import React from 'react'
import { Habit, repeatIntervalUnits } from '../../store/common'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { Form } from 'react-final-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { DatePicker, Select, TextField } from 'mui-rff'
import { Button, createStyles, MenuItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ymdToDate } from '../ymdUtils'

interface Props {
  onClose?: () => void
  existingHabit?: Habit
}

interface HabitFormState extends Omit<Habit, 'id' | 'deletedAt' | 'startDate'> {
  startDate: Date
}

const fieldLabel: (s: string) => React.ReactNode = (s) => (
  <FormattedMessage
    id={`HabitForm.${s}.label`}
    defaultMessage={s}/>
)

const useStyles = makeStyles((theme) => createStyles({
  weekdayRow: {
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  weekdayButton: {
    borderRadius: '50%',
    minWidth: '36px',
    width: '36px',
    height: '36px',
    margin: theme.spacing(0.5)
  }
}))

export default function HabitForm ({ existingHabit, onClose }: Props): React.ReactElement {
  const classes = useStyles()
  const intl = useIntl()
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)
  const initialState: HabitFormState = existingHabit === undefined ? (
    {
      name: '',
      repeatInterval: 1,
      repeatIntervalUnit: 'weekday',
      startDate: ymdToDate(todayDate),
      notify: false,
      notificationTime: null,
      repeatSunday: false,
      repeatMonday: false,
      repeatTuesday: false,
      repeatWednesday: false,
      repeatThursday: false,
      repeatFriday: false,
      repeatSaturday: false
    }
  ) : {...existingHabit, startDate: ymdToDate(existingHabit.startDate) }
  const weekdayOptions = ['repeatSunday', 'repeatMonday', 'repeatTuesday', 'repeatWednesday', 'repeatThursday',
    'repeatFriday', 'repeatSaturday']
  return (
    <Form
      onSubmit={console.log}
      initialValues={initialState}
      render={({ handleSubmit, values, form }) => (
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            variant="outlined"
            label={fieldLabel('name')}
            name="name"
            type="text"
            helperText={<FormattedMessage id="HabitForm.name.helperText"/>} />
          <Select
            variant="outlined"
            formControlProps={{ margin: 'normal' }}
            label={fieldLabel('repeatIntervalUnit')}
            name="repeatIntervalUnit">
            {repeatIntervalUnits.map(u => (
              <MenuItem value={u}>
                <FormattedMessage id={`HabitForm.repeatIntervalUnit.values.${u}`}/>
              </MenuItem>
            ))}
          </Select>
          {values.repeatIntervalUnit === 'weekday' && (
            <div>
              <Typography component="p" variant="body1">
                <FormattedMessage id="HabitForm.daysToRepeat"/>
              </Typography>
              <div className={classes.weekdayRow}>
                {weekdayOptions.map(day => (
                  <Button
                    key={day}
                    className={classes.weekdayButton}
                    variant={values[day] ? 'contained' : 'text'}
                    color={values[day] ? 'primary' : 'default'}
                    aria-label={intl.formatMessage({ id: `HabitForm.${day}.label` })}
                    title={intl.formatMessage({ id: `HabitForm.${day}.label` })}
                    onClick={() => form.change(day, !values[day])}
                  >
                    <FormattedMessage id={`HabitForm.${day}.abbr`}/>
                  </Button>
                ))}
              </div>
            </div>
          )}
          {['day', 'week', 'month'].includes(values.repeatIntervalUnit) && (
            <TextField
              margin="normal"
              variant="outlined"
              label={fieldLabel(`repeat_${values.repeatIntervalUnit}`)}
              name="repeatInterval"
              type="number"/>
          )}
          <DatePicker
            labelFunc={(date, invalidLabel) => date === null ? invalidLabel : intl.formatDate(date)}
            inputVariant="outlined" disableToolbar variant="inline" label={fieldLabel('startDate')} name="startDate"/>
        </form>
      )}/>
  )
}
