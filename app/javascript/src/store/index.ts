import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { rootReducer, RootState } from './rootReducer'

const store = configureStore({
  reducer: rootReducer
})

export type AppDispatch = typeof store.dispatch
export type AppThunk<T = any> = (dispatch: AppDispatch, getState: () => RootState) => T
export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export default store
