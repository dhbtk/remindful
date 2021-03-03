import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Container, createStyles, Paper } from '@material-ui/core'
import DaySummary from '../daily/DaySummary'
import DayInformation from '../weekly/DayInformation'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { loadDayData, loadOverdueTasks } from '../../store/commonActions'
import { makeStyles } from '@material-ui/core/styles'
import LayoutContent from '../app/LayoutContent'

const useStyles = makeStyles((theme) => createStyles({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    flex: '1',
    backgroundColor: theme.palette.background.paper
  }
}))

export default function TodayPage (): React.ReactElement {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const todayDate = useSelector<RootState, string>(state => state.daily.todayDate)
  useEffect(() => {
    dispatch(loadDayData(todayDate)).catch(console.error)
    dispatch(loadOverdueTasks()).catch(console.error)
  }, [dispatch, todayDate])

  return (
    <LayoutContent
      title={<FormattedMessage id="TodayPage.title"/>}
      actions={[]}>
      <Container maxWidth="md" className={classes.container}>
        <DaySummary date={todayDate}/>
        <DayInformation date={todayDate} overdue/>
        <DayInformation date={todayDate}/>
      </Container>
    </LayoutContent>
  )
}
