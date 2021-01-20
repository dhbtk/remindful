import { combineReducers } from '@reduxjs/toolkit'
import userInfoSlice from './user'
import plannerEvents from './plannerEvents'
import dailySlice from './daily'
import layoutSlice from './layout'

export const rootReducer = combineReducers({
  user: userInfoSlice.reducer,
  plannerEvents: plannerEvents,
  daily: dailySlice.reducer,
  layout: layoutSlice.reducer
})

export type RootState = ReturnType<typeof rootReducer>
