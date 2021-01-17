import {UserInfo} from "./user";
import {useSelector} from "react-redux";
import {RootState} from "./rootReducer";

export class Authentication {
  private user: UserInfo;

  constructor(user: UserInfo) {
    this.user = user
  }

  isLightUser(): boolean {
    return this.user?.anonymous || false
  }

  isAuthenticated(): boolean {
    return !!this.user.accessToken
  }
}

export const useAuth = () => new Authentication(useSelector<RootState, UserInfo>(state => state.user.user))
