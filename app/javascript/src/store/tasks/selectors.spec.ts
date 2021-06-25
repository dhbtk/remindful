import { getDayTasks, getOverdueTasks, getRangeOfDaysWithTasks, getTodayTasks } from './selectors'
import { RootState } from '../rootReducer'
import { ymd, ymdToDate } from '../../ui/ymdUtils'
import { Task } from '../../models/tasks'
import { addDays } from 'date-fns'

describe('store/tasks/selectors.ts', () => {
  const today = ymd(new Date())
  const stateFactory = (eventDates: string[], todayDate: string = ymd(new Date())): RootState => {
    const entities: { [id: number]: Task } = {}
    eventDates.forEach((eventDate, index) => {
      entities[index] = {
        id: index,
        eventDate,
        content: `${eventDate} - ${index}`,
        status: 'pending',
        actedAt: null,
        order: index
      }
    })
    return {
      tasks: {
        entities,
        overdueIds: []
      },
      daily: {
        todayDate
      }
    } as unknown as RootState
  }
  const yesterday = ymd(addDays(ymdToDate(today), -1))
  const beforeYesterday = ymd(addDays(ymdToDate(today), -2))
  const tomorrow = ymd(addDays(ymdToDate(today), 1))
  const afterTomorrow = ymd(addDays(ymdToDate(today), 2))
  const filledEventDates = [today, today, yesterday, beforeYesterday, today, tomorrow, tomorrow, afterTomorrow, today]

  describe('getOverdueTasks', () => {
    const yesterday = ymd(addDays(ymdToDate(today), -1))
    const beforeYesterday = ymd(addDays(ymdToDate(today), -2))
    let result: Task[]
    beforeEach(() => {
      result = getOverdueTasks(stateFactory([yesterday, beforeYesterday, today]))
    })

    it('does not return the task from today', () => {
      expect(result.find(t => t.eventDate === today)).toBeFalsy()
    })

    it('returns the overdue tasks', () => {
      expect(result.find(t => t.eventDate === yesterday)).toBeTruthy()
      expect(result.find(t => t.eventDate === beforeYesterday)).toBeTruthy()
    })
  })

  describe('getTodayTasks', () => {
    let result: Task[]
    beforeEach(() => {
      result = getTodayTasks(stateFactory(filledEventDates))
    })

    it('returns only tasks for today', () => {
      expect(result.length).toEqual(4)
      expect(result.map(t => t.id)).toEqual([0, 1, 4, 8])
    })
  })

  describe('getDayTasks', () => {
    let result: Task[]
    beforeEach(() => {
      result = getDayTasks(stateFactory(filledEventDates), tomorrow)
    })

    it('returns only tasks for today', () => {
      expect(result.length).toEqual(2)
      expect(result.map(t => t.id)).toEqual([5, 6])
    })
  })

  describe('getRangeOfTasksWithDays', () => {
    let result: string[]
    describe('when list of days is empty', () => {
      beforeEach(() => {
        result = getRangeOfDaysWithTasks(stateFactory([]))
      })

      it('returns an empty array', () => {
        expect(result).toEqual([])
      })
    })

    describe('when given a single date', () => {
      beforeEach(() => {
        result = getRangeOfDaysWithTasks(stateFactory([today]))
      })

      it('returns an array with a single date', () => {
        expect(result).toEqual([today])
      })
    })

    describe('when given two consecutive days', () => {
      const tomorrow = ymd(addDays(ymdToDate(today), 1))

      beforeEach(() => {
        result = getRangeOfDaysWithTasks(stateFactory([tomorrow, today]))
      })

      it('returns an array with the two dates in order', () => {
        expect(result).toEqual([today, tomorrow])
      })
    })

    describe('when given three non-consecutive days', () => {
      const expected = ['2021-06-01', '2021-06-02', '2021-06-03', '2021-06-04', '2021-06-05']

      beforeEach(() => {
        result = getRangeOfDaysWithTasks(stateFactory(['2021-06-01', '2021-06-04', '2021-06-05'], '2021-06-01'))
      })

      it('returns an array with intermediary dates removed', () => {
        expect(result).toEqual(expected)
      })
    })
  })
})
