import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import DaySummary from '../daily/DaySummary'
import DayInformation from '../weekly/DayInformation'
import { useAppDispatch } from '../../store'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/rootReducer'
import { loadDayData, loadOverdueTasks } from '../../store/commonActions'
import LayoutContent from '../app/LayoutContent'
import LayoutContainer from '../app/LayoutContainer'

export default function TodayPage (): React.ReactElement {
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
      <LayoutContainer maxWidth="md">
        <DaySummary date={todayDate}/>
        <DayInformation date={todayDate} overdue/>
        <DayInformation date={todayDate}/>
      </LayoutContainer>
    </LayoutContent>
  )
}
