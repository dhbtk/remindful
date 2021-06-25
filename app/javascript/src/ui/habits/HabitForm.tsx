import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { Form, FormRenderProps } from 'react-final-form'
import { FormattedMessage, useIntl } from 'react-intl'
import { Checkboxes, DatePicker, makeValidate, Select, TextField, TimePicker } from 'mui-rff'
import { Button, createStyles, MenuItem, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { ymd, ymdToDate } from '../ymdUtils'
import * as Yup from 'yup'
import { AnySchema } from 'yup'
import { useTranslator } from '../forms'
import createDecorator from 'final-form-calculate'
import { Decorator } from 'final-form'
import { IntlShape } from 'react-intl/src/types'
import habitApi from '../../api/habitApi'
import { Habit, repeatIntervalUnits, weekdayOptions } from '../../models/habits'

interface Props {
  onClose?: () => void
  existingHabit?: Habit
}

export interface HabitFormState extends Omit<Habit, 'id' | 'deletedAt'> {
  startDateDate: Date
  notificationTimeDate: Date | null
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
  },
  paddedBox: {
    padding: theme.spacing(1.5)
  }
}))

const schema = Yup.object().shape({
  name: Yup.string().required(),
  repeatInterval: Yup.number().required().positive().integer(),
  notify: Yup.boolean(),
  notificationTimeDate: Yup.date().nullable().when('notify', {
    is: true,
    then: Yup.date().required()
  }),
  notificationTime: Yup.string().nullable(),
  startDate: Yup.string().required(),
  startDateDate: Yup.date().required(),
  repeatIntervalUnit: Yup.string().required(),
  repeatSunday: Yup.boolean(),
  repeatMonday: Yup.boolean(),
  repeatTuesday: Yup.boolean(),
  repeatWednesday: Yup.boolean(),
  repeatThursday: Yup.boolean(),
  repeatFriday: Yup.boolean(),
  repeatSaturday: Yup.boolean()
}) as AnySchema<HabitFormState>

const formDecorator = (intl: IntlShape): Decorator<HabitFormState, HabitFormState> => createDecorator(
  {
    field: 'notificationTimeDate',
    updates: {
      notificationTime: t => t === null ? null : intl.formatDate(t, { hour: 'numeric', minute: 'numeric' })
    }
  },
  {
    field: 'startDateDate',
    updates: {
      startDate: d => ymd(d)
    }
  },
  {
    field: 'notify',
    updates: {
      notificationTimeDate: (value, allValues) => {
        if (value as boolean) {
          return (allValues as HabitFormState).notificationTimeDate
        } else {
          return null
        }
      }
    }
  }
) as Decorator<HabitFormState, HabitFormState>

export default function HabitForm ({ existingHabit, onClose }: Props): React.ReactElement {
  const classes = useStyles()
  const intl = useIntl()
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)
  const initialState: HabitFormState = existingHabit === undefined ? (
    {
      name: '',
      repeatInterval: 1,
      repeatIntervalUnit: 'weekday',
      startDate: todayDate,
      startDateDate: ymdToDate(todayDate),
      notify: false,
      notificationTime: null,
      notificationTimeDate: null,
      repeatSunday: false,
      repeatMonday: false,
      repeatTuesday: false,
      repeatWednesday: false,
      repeatThursday: false,
      repeatFriday: false,
      repeatSaturday: false
    }
  ) : { ...existingHabit, startDateDate: ymdToDate(existingHabit.startDate), notificationTimeDate: new Date() }
  const { translateServerErrors, translator } = useTranslator('HabitForm')
  const decorator = formDecorator(intl)
  const [formLoading, setFormLoading] = useState(false)
  async function onSubmit (values: HabitFormState): Promise<Record<string, string> | undefined> {
    setFormLoading(true)
    const response = existingHabit === undefined ? await habitApi.create(values) : await habitApi.update(existingHabit.id, values)
    setFormLoading(false)
    if (response === undefined) {
      if (onClose !== undefined) {
        onClose()
      }
    } else {
      return translateServerErrors(response)
    }
  }
  return (
    <Form
      onSubmit={onSubmit}
      decorators={[decorator]}
      initialValues={initialState}
      validate={makeValidate(schema, translator)}
      render={({ handleSubmit, values, form }: FormRenderProps<HabitFormState>) => (
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
              <MenuItem value={u} key={u}>
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
                {(weekdayOptions as Array<keyof HabitFormState>).map(day => (
                  <Button
                    key={day}
                    className={classes.weekdayButton}
                    variant={(values[day] as boolean) ? 'contained' : 'text'}
                    color={(values[day] as boolean) ? 'primary' : 'default'}
                    aria-label={intl.formatMessage({ id: `HabitForm.${day}.label` })}
                    title={intl.formatMessage({ id: `HabitForm.${day}.label` })}
                    onClick={() => form.change(day, !(values[day] as boolean))}
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
            inputVariant="outlined" disableToolbar variant="inline" label={fieldLabel('startDate')} name="startDateDate"/>
          <div className={classes.paddedBox}>
            <Checkboxes
              name="notify"
              data={{ label: fieldLabel('notify'), value: true }}
            />
          </div>
          <TimePicker
            disabled={!values.notify}
            ampm={false}
            inputVariant="outlined"
            label={fieldLabel('notificationTime')}
            name="notificationTimeDate"/>
          <div className={classes.paddedBox}>
            <Button type="submit" variant="contained" color="primary" disabled={formLoading}>
              <FormattedMessage id="HabitForm.submit"/>
            </Button>
          </div>
          <pre>
            {JSON.stringify(values, null, 2)}
          </pre>
        </form>
      )}/>
  )
}
