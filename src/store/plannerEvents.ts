import {PlannerEvent} from "./common";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {loadDayData} from "./daily";
import {formatISO} from 'date-fns'
import plannerEventApi from "../api/plannerEventApi";
import {debounce} from 'underscore'

export interface PlannerEventsState {
  entities: { [id: number]: PlannerEvent }
}

export const completePlannerEvent = (id: number) => async (dispatch: (a: any) => any, getState: () => any) => {
  const plannerEvent = (getState().plannerEvents as PlannerEventsState).entities[id]
  const updatedPlannerEvent: PlannerEvent = {...plannerEvent, status: 'done', actedAt: formatISO(new Date())}
  dispatch(setPlannerEvent(updatedPlannerEvent))
  await plannerEventApi.update(updatedPlannerEvent)
}

export const undoCompletePlannerEvent = (id: number) => async (dispatch: (a: any) => any, getState: () => any) => {
  const plannerEvent = (getState().plannerEvents as PlannerEventsState).entities[id]
  const updatedPlannerEvent: PlannerEvent = {...plannerEvent, status: 'pending', actedAt: null}
  dispatch(setPlannerEvent(updatedPlannerEvent))
  await plannerEventApi.update(updatedPlannerEvent)
}

const debouncedUpdate = debounce((plannerEvent: PlannerEvent) => plannerEventApi.update(plannerEvent), 350)

export const updatePlannerEventText = (id: number, content: string) => async (dispatch: (a: any) => any, getState: () => any) => {
  const plannerEvent = (getState().plannerEvents as PlannerEventsState).entities[id]
  const updatedPlannerEvent: PlannerEvent = {...plannerEvent, content}
  dispatch(setPlannerEvent(updatedPlannerEvent))
  await debouncedUpdate(updatedPlannerEvent)
}

const plannerEventsSlice = createSlice({
  name: 'plannerEvents',
  initialState: {entities: {}} as PlannerEventsState,
  reducers: {
    setPlannerEvent(state: PlannerEventsState, {payload}: PayloadAction<PlannerEvent>) {
      state.entities[payload.id] = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(loadDayData.fulfilled, (state: PlannerEventsState, {payload}) => {
      payload.plannerEvents.forEach(plannerEvent => {
        state.entities[plannerEvent.id] = plannerEvent
      })
    })
  }
})

export const {setPlannerEvent} = plannerEventsSlice.actions

export default plannerEventsSlice
