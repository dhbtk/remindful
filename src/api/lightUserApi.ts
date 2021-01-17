import {formPost} from "./fetchWrappers";
import {UserInfo} from "../store/user";

const CLIENT_ID = 'fo5gp2IksBAq7ArIs49TFcZBlohYKaAiwysFaQdj_HM'
const CLIENT_SECRET = '1vZJLuK4MvGnlaxezQN0djwzKxmnCulSBlNduXHN1nc'

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
