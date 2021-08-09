import { createStyles, Typography } from '@material-ui/core'
import React from 'react'
import { useIntl } from 'react-intl'
import { makeStyles } from '@material-ui/core/styles'
import EventIcon from '@material-ui/icons/Event'
import { ymdToDate } from '../ymdUtils'
import { Task } from '../../models/tasks'

const useStyles = makeStyles(theme => createStyles({
  root: {
    display: 'inline-flex',
    marginLeft: -theme.spacing(1),
    paddingRight: theme.spacing(1),
    alignItems: 'center'
  },
  icon: {
    fill: theme.palette.warning.main,
    width: '20px',
    height: '20px'
  },
  text: {
    fontSize: '0.75rem',
    color: theme.palette.warning.main,
    paddingLeft: theme.spacing(0.5),
    whiteSpace: 'nowrap'
  }
}))

export default function TaskDateDisplay ({ task }: { task: Task }): React.ReactElement {
  const intl = useIntl()
  const classes = useStyles()
  const dateString = intl.formatDate(ymdToDate(task.eventDate), { month: 'long', day: 'numeric' })
  return (
    <div className={classes.root}>
      <EventIcon className={classes.icon} />
      <Typography component="span" variant="body2" className={classes.text}>
        {dateString}
      </Typography>
    </div>
  )
}
