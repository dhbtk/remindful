import { createAction, createSlice } from '@reduxjs/toolkit'
import { OptionsObject, SnackbarKey, SnackbarMessage } from 'notistack'

export interface SnackNotification {
  message: SnackbarMessage
  key: SnackbarKey
  options?: OptionsObject
  dismissed: boolean
}

export interface SnackConstructor {
  message: SnackbarMessage
  options?: OptionsObject
}

export interface LayoutState {
  drawerOpen: boolean
  notifications: SnackNotification[]
}

const initialState: LayoutState = {
  drawerOpen: false,
  notifications: []
}

export const enqueueNotification = createAction('enqueueNotification', (notification: SnackConstructor) => {
  const key = notification.options?.key ?? new Date().getTime() + Math.random()
  const returnedNotification: SnackNotification = { ...notification, dismissed: false, key }
  return {
    payload: returnedNotification
  }
})

export const closeNotification = createAction<SnackbarKey | null>('closeNotification')
export const removeNotification = createAction<SnackbarKey>('removeNotification')

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleDrawer (state: LayoutState) {
      state.drawerOpen = !state.drawerOpen
    }
  },
  extraReducers: builder => {
    builder.addCase(enqueueNotification, (state: LayoutState, { payload }) => {
      state.notifications.push(payload)
    })
    builder.addCase(closeNotification, (state: LayoutState, { payload }) => {
      if (payload === null) {
        state.notifications.forEach(notification => {
          notification.dismissed = true
        })
      } else {
        const notification = state.notifications.find(it => it.key === payload)
        if (notification !== undefined) {
          notification.dismissed = true
        }
      }
    })
    builder.addCase(removeNotification, (state: LayoutState, { payload }) => {
      state.notifications = state.notifications.filter(it => it.key !== payload)
    })
  }
})

export const { toggleDrawer } = layoutSlice.actions
export default layoutSlice
