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

export type TaskStatus = 'pending' | 'done' | 'dismissed'

export interface Task {
  id: number
  eventDate: string
  content: string
  status: TaskStatus
  actedAt: string | null
  habitId?: number
  habit?: Habit
}

export interface WaterGlass {
  id: number
  day: string
  drankAt: string
}
