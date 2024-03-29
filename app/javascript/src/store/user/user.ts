import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import userApi from '../../api/userApi'
import { LoadStatus } from '../../models/common'
import { Pronouns } from '../../models/registrationForm'
import { resetState } from '../common/commonActions'

export const ACCESS_TOKEN_KEY = 'userToken'

export interface AnonymousUserInfo {
  anonymous: true
}

export interface RegisteredUserInfo {
  email: string
  name: string
  avatarUrl: string
  anonymous: false
  pronouns: Pronouns
}

export type UserInfo = AnonymousUserInfo | RegisteredUserInfo

export interface UserState {
  initialLoadDone: boolean
  status: LoadStatus
  user: UserInfo
  accessToken: string | null
}

const initialState: UserState = { initialLoadDone: false, status: 'idle', user: { anonymous: true }, accessToken: null }

export const registerLightUser = createAsyncThunk('user/registerLightUser', async () => {
  const accessToken = await userApi.registerLightUser()
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  return accessToken
})

export const loadUserInfo = createAsyncThunk('user/loadUserInfo', async () => {
  return await userApi.loadUserInfo()
})

const userInfoSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo (state: UserState, action: PayloadAction<UserInfo>) {
      state.user = action.payload
    },
    setAccessToken (state: UserState, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },
    clearUserInfo (state: UserState) {
      state.user = { anonymous: true }
      state.accessToken = null
    },
    loadingStart (state: UserState) {
      state.status = 'loading'
    },
    loadingFinish (state: UserState) {
      state.status = 'idle'
    },
    loadingFail (state: UserState) {
      state.status = 'failed'
    },
    setInitialLoad (state: UserState, action: PayloadAction<boolean>) {
      state.initialLoadDone = action.payload
    }
  },
  extraReducers: builder => {
    builder.addCase(resetState, () => ({ ...initialState }))
    builder.addCase(registerLightUser.pending, (state: UserState) => {
      state.status = 'loading'
    })
    builder.addCase(loadUserInfo.pending, (state: UserState) => {
      state.status = 'loading'
    })
    builder.addCase(registerLightUser.rejected, (state: UserState) => {
      state.status = 'failed'
    })
    builder.addCase(registerLightUser.fulfilled, (state: UserState, { payload }) => {
      state.status = 'idle'
      state.accessToken = payload
    })
    builder.addCase(loadUserInfo.fulfilled, (state: UserState, { payload }) => {
      state.status = 'idle'
      state.user = payload
    })
  }
})

export const { setUserInfo, clearUserInfo, setAccessToken, loadingStart, loadingFinish, loadingFail, setInitialLoad } = userInfoSlice.actions

export default userInfoSlice
