import React, { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import DaySummary from '../daily/DaySummary'
import DayInformation from '../weekly/DayInformation'
import { useAppDispatch } from '../../store'
import { bulkLoadTasks, loadOverdueTasks } from '../../store/common/commonActions'
import LayoutContent from '../layout/DrawerLayout/LayoutContent'
import LayoutContainer from '../layout/DrawerLayout/LayoutContainer'
import { use } from '../../store/use'
import { getHomeScreenDays, getTodayDate } from '../../store/common/selectors'
import { getVisibleHomeScreenDays } from '../../store/tasks/selectors'
import { TodaySkeleton } from './TodaySkeleton'

export default function TodayPage (): React.ReactElement {
  const dispatch = useAppDispatch()
  const todayDate = use(getTodayDate)
  const homeScreenDays = use(getHomeScreenDays)
  const visibleHomeScreenDays = use(getVisibleHomeScreenDays)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const refresh = () => {
    if (loading) {
      return
    }

    setLoading(true)
    setError(false)
    Promise.all([dispatch(bulkLoadTasks(homeScreenDays)),
      dispatch(loadOverdueTasks())
    ]).then(() => {
      setLoading(false)
      setError(false)
      setInitialLoadDone(true)
    }).catch((e: any) => {
      console.error(e)
      setLoading(false)
      setError(true)
      setTimeout(() => refresh(), 1000)
    })
  }

  useEffect(refresh, [dispatch, homeScreenDays])
  useEffect(() => {
    const interval = setInterval(refresh, 60000)
    return () => clearInterval(interval)
  }, [dispatch, homeScreenDays])
  useEffect(() => {
    const listener = () => {
      if (document.visibilityState === 'visible') {
        refresh()
      }
    }
    document.addEventListener('visibilitychange', listener)
    return () => document.removeEventListener('visibilitychange', listener)
  }, [dispatch, homeScreenDays])

  return (
    <LayoutContent
      title={<FormattedMessage id="TodayPage.title"/>}
      actions={[]}>
      <LayoutContainer maxWidth="md">
        {error && 'Error!!!'}
        <DaySummary date={todayDate} onRefresh={refresh} loading={loading}/>
        { initialLoadDone ? (
          <React.Fragment>
            <DayInformation date={todayDate} overdue/>
            {visibleHomeScreenDays.map(date => <DayInformation date={date} key={date}/>)}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TodaySkeleton />
            <TodaySkeleton />
          </React.Fragment>
        )}
      </LayoutContainer>
    </LayoutContent>
  )
}
