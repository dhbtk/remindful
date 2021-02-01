import { WaterGlass } from '../store/common'
import { apiGet, unwrap } from './fetchWrappers'

const waterGlassApi = {
  forDate: async (date: string): Promise<WaterGlass[]> => {
    return await apiGet<WaterGlass[]>('/api/water_glasses', { date }).then(unwrap)
  }
}

export default waterGlassApi
