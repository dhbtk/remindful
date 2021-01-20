import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { rootReducer, RootState } from './rootReducer'

const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export type AppThunk<T = any> = (dispatch: AppDispatch, getState: () => RootState) => T
export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>()
export default store
