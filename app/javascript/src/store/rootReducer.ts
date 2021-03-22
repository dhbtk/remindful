import { combineReducers } from '@reduxjs/toolkit'
import userInfoSlice from './user'
import tasks from './tasks'
import dailySlice from './daily'
import layoutSlice from './layout'
import { habits } from './habits'

export const rootReducer = combineReducers({
  user: userInfoSlice.reducer,
  tasks,
  daily: dailySlice.reducer,
  layout: layoutSlice.reducer,
  habits
})

export type RootState = ReturnType<typeof rootReducer>
