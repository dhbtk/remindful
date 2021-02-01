import { PlannerEvent } from '../store/common'
import { apiDelete, apiGet, apiPatch, apiPost, unwrap } from './fetchWrappers'

const plannerEventApi = {
  forDate: async (date: string): Promise<PlannerEvent[]> => {
    return await apiGet<PlannerEvent[]>('/api/planner_events', { date }).then(unwrap)
  },
  create: async (plannerEvent: PlannerEvent): Promise<void> => {
    await apiPost('/api/planner_events', { plannerEvent }).then(unwrap)
  },
  reorder: async (ids: number[]): Promise<void> => {
    await apiPost('/api/planner_events/reorder', { ids }).then(unwrap)
  },
  update: async (plannerEvent: PlannerEvent): Promise<void> => {
    await apiPatch(`/api/planner_events/${plannerEvent.id}`, { plannerEvent }).then(unwrap)
  },
  destroy: async (id: number): Promise<void> => {
    await apiDelete(`/api/planner_events/${id}`).then(unwrap)
  }
}

export default plannerEventApi
