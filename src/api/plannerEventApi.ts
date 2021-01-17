import {PlannerEvent} from "../store/common";
import {apiGet, apiPatch} from "./fetchWrappers";

const plannerEventApi = {
  forDate: async (date: string): Promise<PlannerEvent[]> => {
    return await apiGet('/api/planner_events', { date })
  },
  create: async (plannerEvent: PlannerEvent): Promise<void> => {
    return await apiPatch('/api/planner_events', { plannerEvent })
  }
}

export default plannerEventApi
