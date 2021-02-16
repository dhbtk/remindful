import React, { useEffect, useMemo } from 'react'
import DrawerLayout from '../app/DrawerLayout'
import { makeStyles } from '@material-ui/core/styles'
import { Button, Container, createStyles, IconButton, Paper, Toolbar, Typography } from '@material-ui/core'
import { Redirect, useParams } from 'react-router-dom'
import { addDays, format, isMonday, parse, startOfWeek } from 'date-fns'
import clsx from 'clsx'
import DayInformation from './DayInformation'
import { FormattedMessage, useIntl } from 'react-intl'
import { lastMonday, nextYmd, previousYmd, ymd, ymdToDate } from '../ymdUtils'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import linkRef from '../app/linkRef'
import { bulkLoadTasks, loadTasks } from '../../store/commonActions'
import { useAppDispatch } from '../../store'

const useStyles = makeStyles((theme) => createStyles({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    flex: '1',
    background: '#fff'
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
  },
  title: {
    flexGrow: '1'
  },
  todayButton: {
    marginRight: theme.spacing(2)
  }
}))

export default function WeeklyPage (): React.ReactElement {
  const classes = useStyles()
  const intl = useIntl()
  const dispatch = useAppDispatch()
  const presentDate = useSelector<RootState, string>(state => state.daily.todayDate)
  const weekDate = useParams<{ weekDate?: string }>().weekDate ?? presentDate
  const dateOffset: (offset: number) => string = offset => ymd(addDays(ymdToDate(weekDate), offset))
  const TodayLink = useMemo(() => linkRef(`/weekly/${presentDate}`), [linkRef, presentDate])

  const previousDate = `/weekly/${dateOffset(-7)}`
  const nextDate = `/weekly/${dateOffset(7)}`
  const PreviousDateLink = useMemo(() => linkRef(previousDate), [linkRef, previousDate])
  const NextDateLink = useMemo(() => linkRef(nextDate), [linkRef, nextDate])

  const allDates = Array.from({ length: 31 }).map((_, i) => dateOffset(i))
  useEffect(() => {
    dispatch(bulkLoadTasks(allDates)).catch(console.error)
  }, [dispatch, allDates])

  return (
    <DrawerLayout title={<FormattedMessage id="WeeklyPage.title" defaultMessage="My Week"/>} actions={[]}>
      <Container maxWidth="md" className={classes.container}>
        <Toolbar variant="dense">
          <Typography component="h2" variant="h6" className={classes.title}>
            {intl.formatDate(ymdToDate(weekDate), { month: 'long', year: 'numeric' })}
          </Typography>
          <Button variant="outlined" component={TodayLink} color="inherit" size="small" className={classes.todayButton}>
            <FormattedMessage id="DailyPage.todayLink" defaultMessage="Today"/>
          </Button>
          <IconButton color="inherit" component={PreviousDateLink} size="small">
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
          <IconButton color="inherit" component={NextDateLink} size="small">
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Toolbar>
        <DayInformation date={presentDate} overdue/>
        {allDates.map(date => (
          <DayInformation date={date} key={date}/>
        ))}
      </Container>
    </DrawerLayout>
  )
}
