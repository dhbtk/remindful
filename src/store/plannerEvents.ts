import { PlannerEvent } from './common'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { loadDayData } from './daily'
import { formatISO } from 'date-fns'
import plannerEventApi from '../api/plannerEventApi'
import { debounce } from 'underscore'
import { AppThunk } from './index'

export interface PlannerEventsState {
  entities: { [id: number]: PlannerEvent }
}

export const completePlannerEvent: (id: number) => AppThunk = (id) => async (dispatch, getState) => {
  const plannerEvent = getState().plannerEvents.entities[id]
  const updatedPlannerEvent: PlannerEvent = { ...plannerEvent, status: 'done', actedAt: formatISO(new Date()) }
  dispatch(setPlannerEvent(updatedPlannerEvent))
  await plannerEventApi.update(updatedPlannerEvent)
}

export const undoCompletePlannerEvent: (id: number) => AppThunk = (id) => async (dispatch, getState) => {
  const plannerEvent = getState().plannerEvents.entities[id]
  const updatedPlannerEvent: PlannerEvent = { ...plannerEvent, status: 'pending', actedAt: null }
  dispatch(setPlannerEvent(updatedPlannerEvent))
  await plannerEventApi.update(updatedPlannerEvent)
}

const debouncedUpdate = debounce(async (plannerEvent: PlannerEvent) => await plannerEventApi.update(plannerEvent), 350)

export const updatePlannerEventText: (id: number, content: string) => AppThunk = (id, content) => async (dispatch, getState) => {
  const plannerEvent = getState().plannerEvents.entities[id]
  const updatedPlannerEvent: PlannerEvent = { ...plannerEvent, content }
  dispatch(setPlannerEvent(updatedPlannerEvent))
  await debouncedUpdate(updatedPlannerEvent)
}

const initialState: PlannerEventsState = { entities: {} }

const plannerEventsSlice = createSlice({
  name: 'plannerEvents',
  initialState,
  reducers: {
    setPlannerEvent (state: PlannerEventsState, { payload }: PayloadAction<PlannerEvent>) {
      state.entities[payload.id] = payload
    }
  },
  extraReducers: builder => {
    builder.addCase(loadDayData.fulfilled, (state: PlannerEventsState, { payload }) => {
      payload.plannerEvents.forEach(plannerEvent => {
        state.entities[plannerEvent.id] = plannerEvent
      })
    })
  }
})

export const { setPlannerEvent } = plannerEventsSlice.actions

export default plannerEventsSlice
