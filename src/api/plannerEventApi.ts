import {PlannerEvent} from "../store/common";
import {apiGet, apiPost} from "./fetchWrappers";

const plannerEventApi = {
  forDate: async (date: string): Promise<PlannerEvent[]> => {
    return await apiGet('/api/planner_events', { date })
  },
  create: async (plannerEvent: PlannerEvent): Promise<void> => {
    return await apiPost('/api/planner_events', { plannerEvent })
  },
  reorder: async (ids: number[]): Promise<void> => {
    return await apiPost('/api/planner_events/reorder', { ids })
  }
}

export default plannerEventApi
