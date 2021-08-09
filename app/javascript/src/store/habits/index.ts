import { LoadStatus } from '../../models/common'
import { createReducer } from '@reduxjs/toolkit'
import { loadHabits, resetState } from '../common/commonActions'
import { Habit } from '../../models/habits'

export interface HabitsState {
  entities: { [id: number]: Habit }
  ids: number[]
  status: LoadStatus
}

const initialState: HabitsState = {
  entities: {},
  ids: [],
  status: 'idle'
}

export const habits = createReducer(initialState, builder => {
  builder.addCase(resetState, () => {
    return { ...initialState }
  })
  builder.addCase(loadHabits.pending, state => {
    state.status = 'loading'
  })
  builder.addCase(loadHabits.fulfilled, (state, { payload }) => {
    state.status = 'idle'
    state.ids = payload.map(it => it.id)
    payload.forEach(habit => {
      state.entities[habit.id] = habit
    })
  })
})
