import { Habit } from './common'
import { createAction } from '@reduxjs/toolkit'

export interface HabitsState {
  entities: { [id: number]: Habit }
  ids: number[]
  newHabit: Habit
}

export const updateNewHabit = createAction<Partial<Habit>>('updateNewHabit')
