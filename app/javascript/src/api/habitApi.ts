import { HabitFormState } from '../ui/habits/HabitForm'
import { apiGet, apiPatch, apiPost, ErrorResponse, isFailedResponse, ResponseWrapper, unwrap } from './fetchWrappers'
import { Habit } from '../models/habits'

const habitApi = {
  create: async (habit: HabitFormState): Promise<undefined | ErrorResponse> => {
    const response: ResponseWrapper<undefined> = await apiPost('/api/habits', { habit })
    if (isFailedResponse(response)) {
      return response.errorBody
    }
  },
  update: async (id: number, habit: HabitFormState): Promise<undefined | ErrorResponse> => {
    const response: ResponseWrapper<undefined> = await apiPatch(`/api/habits/${id}`, { habit })
    if (isFailedResponse(response)) {
      return response.errorBody
    }
  },
  getAll: async (): Promise<Habit[]> => {
    return await apiGet<Habit[]>('/api/habits').then(unwrap)
  }
}

export default habitApi
