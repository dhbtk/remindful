import { PlannerEvent } from './common'
import { createReducer } from '@reduxjs/toolkit'
import { formatISO } from 'date-fns'
import plannerEventApi from '../api/plannerEventApi'
import { debounce } from 'underscore'
import { AppThunk } from './index'
import {
  bulkLoadPlannerEvents,
  loadDayData, loadOverduePlannerEvents,
  loadPlannerEvents, reorderOverduePlannerEvents,
  setPlannerEvent,
  unsetPlannerEvent
} from './commonActions'

export interface PlannerEventsState {
  entities: { [id: number]: PlannerEvent }
  overdueIds: number[]
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

export const deletePlannerEvent: (id: number) => AppThunk = id => async (dispatch, getState) => {
  dispatch(unsetPlannerEvent(id))
  await plannerEventApi.destroy(id)
}

const initialState: PlannerEventsState = { entities: {}, overdueIds: [] }

const plannerEvents = createReducer(initialState, builder => {
  builder.addCase(loadDayData.fulfilled, (state: PlannerEventsState, { payload }) => {
    payload.plannerEvents.forEach(plannerEvent => {
      state.entities[plannerEvent.id] = plannerEvent
    })
  })
  builder.addCase(loadPlannerEvents.fulfilled, (state: PlannerEventsState, { payload }) => {
    payload.forEach(plannerEvent => {
      state.entities[plannerEvent.id] = plannerEvent
    })
  })
  builder.addCase(setPlannerEvent, (state: PlannerEventsState, { payload }) => {
    state.entities[payload.id] = payload
    if (payload.status === 'done' && state.overdueIds.includes(payload.id)) {
      state.overdueIds = state.overdueIds.filter(it => it !== payload.id)
    }
  })
  builder.addCase(bulkLoadPlannerEvents.fulfilled, (state: PlannerEventsState, { payload }) => {
    payload.forEach(plannerEvent => {
      state.entities[plannerEvent.id] = plannerEvent
    })
  })
  builder.addCase(loadOverduePlannerEvents.fulfilled, (state: PlannerEventsState, { payload }) => {
    payload.forEach(plannerEvent => {
      state.entities[plannerEvent.id] = plannerEvent
    })
    state.overdueIds = payload.map(it => it.id)
  })
  builder.addCase(reorderOverduePlannerEvents, (state: PlannerEventsState, { payload }) => {
    state.overdueIds = payload
  })
})

export default plannerEvents
