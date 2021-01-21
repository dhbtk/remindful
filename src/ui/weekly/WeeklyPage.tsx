import React from 'react'
import DrawerLayout from '../app/DrawerLayout'
import { makeStyles } from '@material-ui/core/styles'
import { createStyles, Paper } from '@material-ui/core'
import { Redirect, useParams } from 'react-router-dom'
import { addDays, format, isMonday, parse, startOfWeek } from 'date-fns'
import clsx from 'clsx'
import DayInformation from './DayInformation'

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
  const { weekDate } = useParams<{ weekDate?: string }>()
  const parsedDate = (weekDate !== undefined && parse(weekDate, 'yyyy-MM-dd', new Date())) as Date
  if (weekDate === undefined) {
    const newStartOfWeek = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
    return <Redirect to={`/weekly/${newStartOfWeek}`} />
  } else {
    if (!isMonday(parsedDate)) {
      const newStartOfWeek = format(startOfWeek(parsedDate, { weekStartsOn: 1 }), 'yyyy-MM-dd')
      return <Redirect to={`/weekly/${newStartOfWeek}`} />
    }
  }
  const classes = useStyles()
  const presentDate = format(new Date(), 'yyyy-MM-dd')
  const dateOffset: (offset: number) => string = offset => format(addDays(parsedDate, offset), 'yyyy-MM-dd')
  return (
    <DrawerLayout title="My week" actions={[]}>
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
