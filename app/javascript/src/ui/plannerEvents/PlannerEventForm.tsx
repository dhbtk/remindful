import { PlannerEvent } from '../../store/common'
import React, { useState } from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { Button, TextField } from '@material-ui/core'
import { FormattedMessage, useIntl } from 'react-intl'
import clsx from 'clsx'
import { DatePicker } from '@material-ui/pickers'
import { nextYmd, ymd, ymdToDate } from '../ymdUtils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { useAppDispatch } from '../../store'
import { saveNewPlannerEvent, updatePlannerEvent } from '../../store/daily'

interface Props {
  plannerEvent?: PlannerEvent
  date: string
  onClose: () => void
}

const useStyles = makeStyles(theme => createStyles({
  content: {
    border: '1px solid rgba(0, 0, 0, .2)',
    borderRadius: '3px',
    padding: theme.spacing(1),
    paddingTop: 0
  },
  root: {},
  buttons: {
    marginTop: theme.spacing(1),
    '& > *:not(:last-child)': {
      marginRight: theme.spacing(1)
    }
  },
  contentInput: {
    width: '100%',
    '& > .MuiInputBase-root > .MuiInput-input': {
      ...theme.typography.body2
    }
  },
  dateInput: {
    '& > .MuiInputBase-root > .MuiInput-input': {
      ...theme.typography.body2
    }
  }
}))
export default function PlannerEventForm ({ plannerEvent, date, onClose }: Props): React.ReactElement {
  const dispatch = useAppDispatch()
  const classes = useStyles()
  const creating = plannerEvent === undefined
  const [content, setContent] = useState(plannerEvent?.content ?? '')
  const [eventDate, setEventDate] = useState(plannerEvent?.eventDate ?? date)
  const intl = useIntl()
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)
  const dateFormatter = (date: Date): string => {
    const ymdDate = ymd(date)
    if (todayDate === ymdDate) {
      return intl.formatMessage({ id: 'PlannerEventForm.today' })
    } else if (ymdDate === nextYmd(todayDate)) {
      return intl.formatMessage({ id: 'PlannerEventForm.tomorrow' })
    } else {
      return intl.formatDate(date, { month: 'long', day: 'numeric' })
    }
  }
  const onSubmit = (): void => {
    if (creating) {
      dispatch(saveNewPlannerEvent(eventDate, content))
      setContent('')
    } else if ('id' in plannerEvent) {
      dispatch(updatePlannerEvent({ id: plannerEvent.id, content, eventDate }))
      onClose()
    }
  }

  return (
    <form noValidate autoComplete="off" className={classes.root} onSubmit={onSubmit}>
      <div className={classes.content}>
        <div>
          <TextField
            className={classes.contentInput}
            type="text"
            id="planner-event-form"
            value={content}
            label={intl.formatMessage({ id: 'PlannerEventForm.contentLabel' })}
            placeholder={intl.formatMessage({ id: 'PlannerEventForm.contentLabel' })}
            aria-label={intl.formatMessage({ id: 'PlannerEventForm.contentLabel' })}
            autoFocus
            onChange={e => setContent(e.target.value)} />
        </div>
        <DatePicker
          className={classes.dateInput}
          label={intl.formatMessage({ id: 'PlannerEventForm.eventDate' })}
          disableToolbar
          variant="inline"
          value={ymdToDate(eventDate)}
          onChange={newDate => setEventDate(ymd(newDate))}
          labelFunc={dateFormatter}
        />
      </div>
      <div className={classes.buttons}>
        <Button type="submit" variant="contained" color="primary" size="small" disabled={content.trim().length === 0}>
          <FormattedMessage id={creating ? 'PlannerEventForm.create' : 'PlannerEventForm.save'} defaultMessage="Save"/>
        </Button>
        <Button variant="text" color="default" size="small" onClick={onClose}>
          <FormattedMessage id="PlannerEventForm.cancel" defaultMessage="Cancel"/>
        </Button>
      </div>
    </form>
  )
}
