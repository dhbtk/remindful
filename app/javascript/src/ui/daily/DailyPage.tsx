import React, { useEffect, useMemo } from 'react'
import clsx from 'clsx'
import { Badge, Box, Button, Container, createStyles, Grid, IconButton, Paper } from '@material-ui/core'
import NotificationsIcon from '@material-ui/icons/Notifications'
import { makeStyles } from '@material-ui/core/styles'
import DaySummary from './DaySummary'
import PlannerEventList from '../plannerEvents/PlannerEventList'
import DrawerLayout from '../app/DrawerLayout'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { loadDayData } from '../../store/commonActions'
import { useAppDispatch } from '../../store'
import { nextYmd, previousYmd, ymdToDate } from '../ymdUtils'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import linkRef from '../app/linkRef'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'

const useStyles = makeStyles((theme) => createStyles({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  }
}))

export default function DailyPage (): React.ReactElement {
  const classes = useStyles()
  const { date } = useParams<{ date: string }>()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(loadDayData(date)).catch(console.error)
  }, [dispatch, date])
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)
  const TodayLink = useMemo(() => linkRef(todayDate), [linkRef, todayDate])

  const previousDate = `/daily/${previousYmd(date)}`
  const nextDate = `/daily/${nextYmd(date)}`
  const PreviousDateLink = useMemo(() => linkRef(previousDate), [linkRef, previousDate])
  const NextDateLink = useMemo(() => linkRef(nextDate), [linkRef, nextDate])

  const actions = (
    <React.Fragment>
      <Button variant="outlined" component={TodayLink} color="inherit">
        <FormattedMessage id="DailyPage.todayLink" defaultMessage="Today"/>
      </Button>
      <IconButton color="inherit" component={PreviousDateLink}>
        <ArrowBackIosIcon />
      </IconButton>
      <IconButton color="inherit" component={NextDateLink}>
        <ArrowForwardIosIcon />
      </IconButton>
    </React.Fragment>
  )

  return (
    <DrawerLayout
      title={<FormattedMessage id="DailyPage.title" defaultMessage="{today, date, long}" values={{ today: ymdToDate(date) }}/>}
      actions={actions}>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper className={fixedHeightPaper}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={9}>
                  <DaySummary date={date}/>
                </Grid>
                <Grid item xs={12} md={3}>
                  {'water glasses'}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item md={6} xs={12}>
            <Paper className={classes.paper}>
              <Box>habits</Box>
            </Paper>
          </Grid>
          <Grid item md={6} xs={12}>
            <Paper className={classes.paper}>
              <PlannerEventList date={date}/>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DrawerLayout>
  )
}
