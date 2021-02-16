import { combineReducers } from '@reduxjs/toolkit'
import userInfoSlice from './user'
import tasks from './tasks'
import dailySlice from './daily'
import layoutSlice from './layout'

export const rootReducer = combineReducers({
  user: userInfoSlice.reducer,
  tasks,
  daily: dailySlice.reducer,
  layout: layoutSlice.reducer
})

export type RootState = ReturnType<typeof rootReducer>
