import { HabitEvent } from '../store/common'
import { apiGet } from './fetchWrappers'

const habitEventApi = {
  forDate: async (date: string): Promise<HabitEvent[]> => {
    return await apiGet('/api/habit_events', { date })
  }
}

export default habitEventApi
