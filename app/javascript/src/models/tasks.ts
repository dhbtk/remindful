import { Habit } from './habits'

export type TaskStatus = 'pending' | 'done' | 'dismissed'

export interface Task {
  id: number
  eventDate: string
  content: string
  status: TaskStatus
  actedAt: string | null
  habitId?: number
  habit?: Habit
  order: number
}
