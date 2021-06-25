import { AppThunk } from '../index'
import { ACCESS_TOKEN_KEY, clearUserInfo, loadUserInfo, setAccessToken, setInitialLoad } from './user'
import { ErrorResponse } from '../../api/fetchWrappers'
import userApi from '../../api/userApi'

export const initialUserLoad: () => AppThunk = () => async (dispatch) => {
  const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (savedToken !== null) {
    await dispatch(setAccessToken(savedToken))
    try {
      await dispatch(loadUserInfo())
    } catch (e) {
      await dispatch(clearUserInfo())
    }
  }
  await dispatch(setInitialLoad(true))
}

export const logIn: (email: string, password: string) => AppThunk<Promise<ErrorResponse | null>> = (email, password) => async (dispatch) => {
  const response = await userApi.logIn(email, password)
  if ('errors' in response) {
    return response
  }
  const { accessToken } = response
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  await dispatch(setAccessToken(accessToken))
  await dispatch(loadUserInfo())
  return null
}
