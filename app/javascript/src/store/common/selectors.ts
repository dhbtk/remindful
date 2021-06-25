import { RootState } from '../rootReducer'

export const getTodayDate = (state: RootState): string => state.daily.todayDate
