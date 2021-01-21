import { UserInfo } from './user'
import { useSelector } from 'react-redux'
import { RootState } from './rootReducer'

export class Authentication {
  private readonly user: UserInfo

  constructor (user: UserInfo) {
    this.user = user
  }

  isLightUser (): boolean {
    return this.user?.anonymous ?? false
  }

  isAuthenticated (): boolean {
    return this.user.accessToken !== null
  }
}

export const useAuth: () => Authentication = () => new Authentication(useSelector<RootState, UserInfo>(state => state.user.user))
