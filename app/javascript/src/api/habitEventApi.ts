import { HabitEvent } from '../store/common'
import { apiGet, unwrap } from './fetchWrappers'

const habitEventApi = {
  forDate: async (date: string): Promise<HabitEvent[]> => {
    return await apiGet<HabitEvent[]>('/api/habit_events', { date }).then(unwrap)
  }
}

export default habitEventApi
