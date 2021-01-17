import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import lightUserApi from "../api/lightUserApi";
import {LoadStatus} from "./common";

export interface UserInfo {
  username: string | null
  email: string | null
  accessToken: string | null
  name: string | null
  avatarUrl: string | null
  anonymous: boolean | null
}

export interface UserState {
  status: LoadStatus
  user: UserInfo
}

function initialUserInfo(): UserInfo {
  const storedUserInfo: string | null = window.localStorage.getItem('userInfo')
  if (storedUserInfo === null) {
    return {
      username: null,
      email: null,
      accessToken: null,
      name: null,
      avatarUrl: null,
      anonymous: null
    }
  } else {
    return JSON.parse(storedUserInfo)
  }
}

const initialState: UserState = { status: 'idle', user: initialUserInfo() }

export const registerLightUser = createAsyncThunk('user/registerLightUser', async () => {
  const userInfo = await lightUserApi.register()
  window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
  return userInfo as UserInfo
})

const userInfoSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(state: UserState, action: PayloadAction<UserInfo>) {
      state.user = action.payload
    },
    clearUserInfo(state: UserState) {
      state.user = {
        username: null,
        email: null,
        accessToken: null,
        name: null,
        avatarUrl: null,
        anonymous: null
      }
    },
    loadingStart(state: UserState) {
      state.status = 'loading'
    },
    loadingFinish(state: UserState) {
      state.status = 'idle'
    },
    loadingFail(state: UserState) {
      state.status = 'failed'
    }
  },
  extraReducers: builder => {
    builder.addCase(registerLightUser.pending, (state: UserState) => {
      state.status = 'loading';
    })
    builder.addCase(registerLightUser.rejected, (state: UserState) => {
      state.status = 'failed';
    })
    builder.addCase(registerLightUser.fulfilled, (state: UserState, { payload }) => {
      state.status = 'idle'
      state.user = payload
    })
  }
})

export const { setUserInfo, clearUserInfo, loadingStart, loadingFinish, loadingFail } = userInfoSlice.actions

export default userInfoSlice
