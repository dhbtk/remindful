import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { rootReducer, RootState } from './rootReducer'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'

const persistConfig = {
  key: 'root',
  version: 1,
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
})

const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type AppThunk<T = any> = (dispatch: AppDispatch, getState: () => RootState) => T
export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>()
export default store
export { persistor }
