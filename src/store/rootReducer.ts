import {combineReducers} from "@reduxjs/toolkit";
import userInfoSlice from "./user";

export const rootReducer = combineReducers({
  user: userInfoSlice.reducer
})

export type RootState = ReturnType<typeof rootReducer>
