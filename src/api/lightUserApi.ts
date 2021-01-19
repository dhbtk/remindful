import {formPost} from "./fetchWrappers";
import {UserInfo} from "../store/user";

const CLIENT_ID = '8eI-VWlFrqAwaUHTpynIK9iuTJo9Hz0b40pxwjZwpEQ'
const CLIENT_SECRET = 'Cu9z0g0sAPR1vRebVCzCweGmNR4JXF8gHtpMcmHNnek'

interface LightUserResponse {
  username: string
  accessToken: string
}

const lightUserApi = {
  register: async (): Promise<UserInfo> => {
    const response: LightUserResponse = await formPost('/api/light_user', { clientId: CLIENT_ID });
    return {
      username: response.username,
      email: null,
      accessToken: response.accessToken,
      name: null,
      avatarUrl: null,
      anonymous: true
    }
  }
}

export default lightUserApi
