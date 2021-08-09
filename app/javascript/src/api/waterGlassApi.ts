import { apiGet, unwrap } from './fetchWrappers'
import { WaterGlass } from '../models/waterGlasses'

const waterGlassApi = {
  forDate: async (date: string): Promise<WaterGlass[]> => {
    return await apiGet<WaterGlass[]>('/api/water_glasses', { date }).then(unwrap)
  }
}

export default waterGlassApi
