import {PlannerEvent} from "./common";
import {createAction, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DailyState, loadDayData, NewPlannerEvent} from "./daily";

export interface PlannerEventsState {
  entities: { [id: number]: PlannerEvent }
}

const plannerEventsSlice = createSlice({
  name: 'plannerEvents',
  initialState: { entities: {} } as PlannerEventsState,
  reducers: {
    addPlannerEvent(state: PlannerEventsState, { payload }: PayloadAction<PlannerEvent>) {
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

export const { addPlannerEvent } = plannerEventsSlice.actions
