import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { createStyles, Typography } from '@material-ui/core'
import TaskList from '../tasks/TaskList'
import { makeStyles } from '@material-ui/core/styles'
import linkRef from '../app/linkRef'
import { ymdToDate } from '../ymdUtils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'

export interface Props {
  date: string
  overdue?: boolean
}

const useStyles = makeStyles((theme) => createStyles({
  dayName: {
    textAlign: 'left',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    borderBottom: '1px solid rgba(0, 0, 0, .08)',
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginBottom: 0,
    marginTop: theme.spacing(3)
  }
}))

export default function DayInformation ({ date, overdue }: Props): React.ReactElement {
  const intl = useIntl()
  const isOverdue = overdue !== undefined && overdue
  const classes = useStyles()
  const to = `/daily/${date}`
  const CustomLink = useMemo(() => linkRef(to), [to, linkRef])
  if (isOverdue && useSelector<RootState, boolean>(s => s.tasks.overdueIds.length === 0)) {
    return <React.Fragment />
  }
  return (
    <React.Fragment>
      <Typography variant="subtitle1" className={classes.dayName} component={isOverdue ? 'h3' : CustomLink}>
        {isOverdue ? (
          intl.formatMessage({ id: 'DayInformation.overdue' })
        ) : (
          intl.formatDate(ymdToDate(date), { weekday: 'long', month: 'numeric', day: 'numeric' })
        )}
      </Typography>
      <TaskList date={date} overdue={overdue}/>
    </React.Fragment>
  )
}
