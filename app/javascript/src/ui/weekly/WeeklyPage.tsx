import React from 'react'
import DrawerLayout from '../app/DrawerLayout'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles, Paper } from '@material-ui/core'
import { Redirect, useParams } from 'react-router-dom'
import { addDays, format, isMonday, parse, startOfWeek } from 'date-fns'
import clsx from 'clsx'
import DayInformation from './DayInformation'
import { FormattedMessage } from 'react-intl'
import { lastMonday, ymd, ymdToDate } from '../ymdUtils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'

const useStyles = makeStyles((theme) => createStyles({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    flex: '1',
    [theme.breakpoints.up('sm')]: {
      display: 'flex'
    }
  },
  daySlice: {
    flex: '1',
    margin: theme.spacing(1),
    padding: theme.spacing(1)
  },
  weekendContainer: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      flex: '1',
      flexDirection: 'column'
    }
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  }
}))

export default function WeeklyPage (): React.ReactElement {
  const classes = useStyles()
  const presentDate = useSelector<RootState, string>(state => state.daily.todayDate)
  const { weekDate } = useParams<{ weekDate?: string }>()
  if (weekDate === undefined) {
    const newStartOfWeek = lastMonday(presentDate)
    return <Redirect to={`/weekly/${newStartOfWeek}`} />
  } else {
    if (!isMonday(ymdToDate(weekDate))) {
      const newStartOfWeek = lastMonday(weekDate)
      return <Redirect to={`/weekly/${newStartOfWeek}`} />
    }
  }
  const dateOffset: (offset: number) => string = offset => ymd(addDays(ymdToDate(weekDate), offset))
  return (
    <DrawerLayout title={<FormattedMessage id="WeeklyPage.title" defaultMessage="My Week"/>} actions={[]}>
      <div className={classes.container}>
        <Paper className={classes.daySlice}>
          <DayInformation date={weekDate} presentDate={presentDate} />
        </Paper>
        <Paper className={classes.daySlice}>
          <DayInformation date={dateOffset(1)} presentDate={presentDate} />
        </Paper>
        <Paper className={classes.daySlice}>
          <DayInformation date={dateOffset(2)} presentDate={presentDate} />
        </Paper>
        <Paper className={classes.daySlice}>
          <DayInformation date={dateOffset(3)} presentDate={presentDate} />
        </Paper>
        <Paper className={classes.daySlice}>
          <DayInformation date={dateOffset(4)} presentDate={presentDate} />
        </Paper>
        <div className={clsx(classes.weekendContainer)}>
          <Paper className={classes.daySlice}>
            <DayInformation date={dateOffset(5)} presentDate={presentDate} />
          </Paper>
          <Paper className={classes.daySlice}>
            <DayInformation date={dateOffset(6)} presentDate={presentDate} />
          </Paper>
        </div>
      </div>
    </DrawerLayout>
  )
}
