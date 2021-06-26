import { RootState } from '../rootReducer'
import { createSelector } from 'reselect'
import { ymd, ymdToDate } from '../../ui/ymdUtils'
import { addDays } from 'date-fns'

export const getTodayDate = (state: RootState): string => state.daily.todayDate
export const getHomeScreenDays = createSelector(
  [getTodayDate],
  (todayDate) => {
    return Array.from({ length: 31 }).map((_, i) => ymd(addDays(ymdToDate(todayDate), i)))
  }
)
