import { PlannerEvent } from '../store/common'
import { apiDelete, apiGet, apiPatch, apiPost, unwrap } from './fetchWrappers'

const plannerEventApi = {
  forDate: async (date: string): Promise<PlannerEvent[]> => {
    return await apiGet<PlannerEvent[]>('/api/planner_events', { date }).then(unwrap)
  },
  forDates: async (dates: string[]): Promise<PlannerEvent[]> => {
    return await apiGet<PlannerEvent[]>('/api/planner_events', { date: dates }).then(unwrap)
  },
  overdue: async (): Promise<PlannerEvent[]> => {
    return await apiGet<PlannerEvent[]>('/api/planner_events', { overdue: 'true' }).then(unwrap)
  },
  create: async (plannerEvent: PlannerEvent): Promise<void> => {
    await apiPost('/api/planner_events', { plannerEvent })
  },
  reorder: async (ids: number[]): Promise<void> => {
    await apiPost('/api/planner_events/reorder', { ids })
  },
  update: async (plannerEvent: Partial<PlannerEvent> & Pick<PlannerEvent, 'id'>): Promise<void> => {
    await apiPatch(`/api/planner_events/${plannerEvent.id}`, { plannerEvent })
  },
  destroy: async (id: number): Promise<void> => {
    await apiDelete(`/api/planner_events/${id}`)
  }
}

export default plannerEventApi
