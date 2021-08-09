export type RepeatIntervalUnit = 'day' | 'week' | 'month' | 'business_day' | 'weekend' | 'weekday'

export interface Habit {
  id: number
  name: string
  repeatInterval: number
  repeatIntervalUnit: RepeatIntervalUnit
  startDate: string
  notify: boolean
  notificationTime: string | null
  deletedAt: string | null
  repeatSunday: boolean
  repeatMonday: boolean
  repeatTuesday: boolean
  repeatWednesday: boolean
  repeatThursday: boolean
  repeatFriday: boolean
  repeatSaturday: boolean
}

export const repeatIntervalUnits: RepeatIntervalUnit[] = ['business_day', 'weekend', 'weekday', 'day', 'week', 'month']
export const weekdayOptions: Array<keyof Habit> = ['repeatSunday', 'repeatMonday', 'repeatTuesday',
  'repeatWednesday', 'repeatThursday', 'repeatFriday', 'repeatSaturday']
