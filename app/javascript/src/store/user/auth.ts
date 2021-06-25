import { UserState } from './user'
import { useSelector } from 'react-redux'
import { RootState } from '../rootReducer'

export class Authentication {
  private readonly user: UserState

  constructor (user: UserState) {
    this.user = user
  }

  isLightUser (): boolean {
    return this.user.user.anonymous
  }

  isAuthenticated (): boolean {
    return this.user.accessToken !== null
  }
}

export const useAuth: () => Authentication = () => new Authentication(useSelector<RootState, UserState>(state => state.user))
