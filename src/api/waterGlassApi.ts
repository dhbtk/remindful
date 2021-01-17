import {WaterGlass} from "../store/common";
import {apiGet} from "./fetchWrappers";

const waterGlassApi = {
  forDate: async (date: string): Promise<WaterGlass[]> => {
    return await apiGet('/api/water_glasses', { date })
  }
}

export default waterGlassApi
