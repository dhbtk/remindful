export type LoadStatus = 'idle' | 'loading' | 'failed'

export interface Habit {
  id: number
  name: string
  repeatInterval: number
  repeatIntervalUnit: 'day' | 'week' | 'month'
  startDate: string
  notify: boolean
  notificationTime: string | null
  deletedAt: string | null
}

export type EventStatus = 'pending' | 'done' | 'dismissed'

export interface HabitEvent {
  id: number
  habitId: number
  habit?: Habit
  eventDate: string
  originalDate: string | null
  status: EventStatus
  actedAt: string | null
}

export interface PlannerEvent {
  id: number
  eventDate: string
  originalDate?: string | null
  content: string
  status: EventStatus
  actedAt: string | null
}

export interface WaterGlass {
  id: number
  day: string
  drankAt: string
}
