import { RootState } from '../rootReducer'
import { Task } from '../../models/tasks'
import { createSelector } from 'reselect'
import { getTodayDate } from '../common/selectors'
import { ymd, ymdToDate } from '../../ui/ymdUtils'
import { addDays, compareAsc, differenceInCalendarDays, isBefore } from 'date-fns'
import createCachedSelector from 're-reselect'

const getTasks = (state: RootState): Task[] => Object.values(state.tasks.entities)
const sortByOrder = (a: Task, b: Task): number => a.order - b.order

export const getOverdueTasks = createSelector(
  [getTodayDate, getTasks],
  (todayDate, tasks) => {
    const overdueTasks = tasks.filter(task => isBefore(ymdToDate(task.eventDate), ymdToDate(todayDate)))
    overdueTasks.sort(sortByOrder)
    return overdueTasks
  }
)

export const getTodayTasks = createSelector(
  [getTodayDate, getTasks],
  (todayDate, tasks) => {
    const todayTasks = tasks.filter(task => task.eventDate === todayDate)
    todayTasks.sort(sortByOrder)
    return todayTasks
  }
)

const getDateFromProps = (_: RootState, date: string): string => date

export const getDayTasks = createCachedSelector(
  [getDateFromProps, getTasks],
  (date: string, tasks: Task[]) => {
    const dayTasks = tasks.filter(task => task.eventDate === date)
    dayTasks.sort(sortByOrder)
    return dayTasks
  }
)(
  (_state, date) => date
)

export const getAllTasks = createSelector(
  [getTodayDate, getTasks],
  (todayDate, tasks) => {
    return tasks.filter(task => !isBefore(ymdToDate(task.eventDate), ymdToDate(todayDate)))
  }
)

export const getDaysWithTasks = createSelector(
  [getAllTasks],
  (allTasks) => {
    const dates = Array.from(new Set(allTasks.map(task => task.eventDate)))
    dates.sort((a, b) => compareAsc(ymdToDate(a), ymdToDate(b)))
    return dates
  }
)

export const getRangeOfDaysWithTasks = createSelector(
  [getDaysWithTasks],
  (days) => {
    if (days.length === 0) {
      return []
    }
    if (days.length === 1) {
      return [days[0]]
    }

    const firstDate = ymdToDate(days[0])
    const lastDate = ymdToDate(days[days.length - 1])
    const dayDiff = differenceInCalendarDays(lastDate, firstDate)
    return Array.from({ length: dayDiff + 1 }).map((_, index) => {
      return ymd(addDays(firstDate, index))
    })
  }
)
