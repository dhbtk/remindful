import {
  apiGet,
  apiPost,
  ErrorResponse,
  formPost,
  isFailedResponse,
  isSuccessResponse,
  ResponseWrapper,
  unwrap
} from './fetchWrappers'
import { RegisteredUserInfo } from '../store/user'
import { RegistrationFormState } from '../store/registrationForm'

const CLIENT_ID = '8eI-VWlFrqAwaUHTpynIK9iuTJo9Hz0b40pxwjZwpEQ'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CLIENT_SECRET = 'Cu9z0g0sAPR1vRebVCzCweGmNR4JXF8gHtpMcmHNnek'

interface LightUserResponse {
  username: string
  accessToken: string
}

interface UserResponse {
  user: RegisteredUserInfo
}

interface TokenResponse {
  accessToken: string
}

const userApi = {
  registerLightUser: async (): Promise<string> => {
    const response: LightUserResponse = await formPost<LightUserResponse>('/api/light_user', { clientId: CLIENT_ID }).then(unwrap)
    return response.accessToken
  },
  registerFullUser: async (registrationForm: RegistrationFormState): Promise<RegisteredUserInfo | ErrorResponse> => {
    const response: ResponseWrapper<UserResponse> = await apiPost('/api/user', { registrationForm })
    if (isSuccessResponse(response)) {
      return response.successBody.user
    } else if (isFailedResponse(response)) {
      return response.errorBody
    }
    throw new Error('blank response')
  },
  loadUserInfo: async (): Promise<RegisteredUserInfo> => {
    const response: UserResponse = await apiGet<UserResponse>('/api/user').then(unwrap)
    return response.user
  },
  logIn: async (email: string, password: string): Promise<TokenResponse | ErrorResponse> => {
    const response: ResponseWrapper<TokenResponse> = await formPost<TokenResponse>('/oauth/token', {
      grantType: 'password',
      username: email,
      password,
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET
    })
    if (isSuccessResponse(response)) {
      return response.successBody
    } else if (isFailedResponse(response)) {
      return response.errorBody
    }
    throw new Error('blank response')
  }
}

export default userApi
