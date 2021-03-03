import React, { useEffect, useMemo } from 'react'
import { Button, Container, createStyles, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DaySummary from './DaySummary'
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
import DayInformation from '../weekly/DayInformation'
import LayoutContent from '../app/LayoutContent'

const useStyles = makeStyles((theme) => createStyles({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    flex: '1',
    background: theme.palette.background.paper
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
    <LayoutContent
      title={<FormattedMessage id="DailyPage.title" defaultMessage="{today, date, long}" values={{ today: ymdToDate(date) }}/>}
      actions={actions}>
      <Container maxWidth="md" className={classes.container}>
        <DaySummary date={date}/>
        <DayInformation date={date} overdue/>
        <DayInformation date={date}/>
      </Container>
    </LayoutContent>
  )
}
