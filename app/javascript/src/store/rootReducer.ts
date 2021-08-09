import { combineReducers } from '@reduxjs/toolkit'
import userInfoSlice from './user/user'
import tasks from './tasks/tasks'
import dailySlice from './common/daily'
import layoutSlice from './common/layout'
import { habits } from './habits'

export const rootReducer = combineReducers({
  user: userInfoSlice.reducer,
  tasks,
  daily: dailySlice.reducer,
  layout: layoutSlice.reducer,
  habits
})

export type RootState = ReturnType<typeof rootReducer>
