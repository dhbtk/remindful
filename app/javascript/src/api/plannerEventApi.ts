import { PlannerEvent } from '../store/common'
import { apiDelete, apiGet, apiPatch, apiPost } from './fetchWrappers'

const plannerEventApi = {
  forDate: async (date: string): Promise<PlannerEvent[]> => {
    return await apiGet('/api/planner_events', { date })
  },
  create: async (plannerEvent: PlannerEvent): Promise<void> => {
    return await apiPost('/api/planner_events', { plannerEvent })
  },
  reorder: async (ids: number[]): Promise<void> => {
    return await apiPost('/api/planner_events/reorder', { ids })
  },
  update: async (plannerEvent: PlannerEvent): Promise<void> => {
    return await apiPatch(`/api/planner_events/${plannerEvent.id}`, { plannerEvent })
  },
  destroy: async (id: number): Promise<void> => {
    return await apiDelete(`/api/planner_events/${id}`)
  }
}

export default plannerEventApi
