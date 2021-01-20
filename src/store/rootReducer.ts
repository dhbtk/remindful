import {combineReducers} from "@reduxjs/toolkit";
import userInfoSlice from "./user";
import plannerEventsSlice from "./plannerEvents";
import dailySlice from "./daily";
import layoutSlice from "./layout";

export const rootReducer = combineReducers({
  user: userInfoSlice.reducer,
  plannerEvents: plannerEventsSlice.reducer,
  daily: dailySlice.reducer,
  layout: layoutSlice.reducer
})

export type RootState = ReturnType<typeof rootReducer>
