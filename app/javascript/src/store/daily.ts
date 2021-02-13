import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HabitEvent, LoadStatus, PlannerEvent, WaterGlass } from './common'
import { format } from 'date-fns'
import plannerEventApi from '../api/plannerEventApi'
import { AppThunk } from './index'
import {
  bulkLoadPlannerEvents,
  loadDayData, loadOverduePlannerEvents,
  loadPlannerEvents, reorderOverduePlannerEvents,
  setPlannerEvent,
  unsetPlannerEvent
} from './commonActions'
import { ymd } from '../ui/ymdUtils'
import { PlannerEventsState } from './plannerEvents'

export interface NewPlannerEvent {
  content: string
  date?: string
}

export interface DayState {
  date: string
  status: LoadStatus
  habitEventIds: number[]
  plannerEventIds: number[]
  deletedPlannerEventIds: number[]
  waterGlassIds: number[]
  newPlannerEvent: NewPlannerEvent
}

export interface DailyState {
  todayDate: string
  days: { [date: string]: DayState }
}

export interface DayData {
  date: string
  habitEvents: HabitEvent[]
  plannerEvents: PlannerEvent[]
  waterGlasses: WaterGlass[]
}

export const saveNewPlannerEvent: (date: string, content: string) => AppThunk = (date, content) => async (dispatch, getState) => {
  const planners = getState().plannerEvents
  const tempId = (Object.values(planners.entities).length === 0) ? 1 : (Math.max(...Object.values(planners.entities).map(p => p.id)) + 1)
  const newPlanner: PlannerEvent = {
    id: tempId,
    eventDate: date,
    status: 'pending',
    actedAt: null,
    content: content
  }
  dispatch(setPlannerEvent(newPlanner))
  await plannerEventApi.create(newPlanner)
  await dispatch(loadDayData(date))
}

export const updatePlannerEvent: (data: Partial<PlannerEvent> & Pick<PlannerEvent, 'id' | 'eventDate'>) => AppThunk = data => async (dispatch, getState) => {
  const currentPlannerEvent = getState().plannerEvents.entities[data.id]
  if (data.eventDate !== currentPlannerEvent.eventDate) {
    const oldDayIds = getState().daily.days[currentPlannerEvent.eventDate].plannerEventIds.filter(id => id !== data.id)
    const newIds = [...getState().daily.days[data.eventDate].plannerEventIds, data.id]
    dispatch(updatePlannerEventIds({ date: data.eventDate, ids: newIds }))
    dispatch(updatePlannerEventIds({ date: currentPlannerEvent.eventDate, ids: oldDayIds }))
    await plannerEventApi.reorder(newIds)
  }
  const updatedEvent: PlannerEvent = { ...currentPlannerEvent, ...data }
  dispatch(setPlannerEvent(updatedEvent))
  await plannerEventApi.update(updatedEvent)
}

export const reorderPlannerEvents: (date: string | null, startIndex: number, endIndex: number) => AppThunk =
  (date, startIndex, endIndex) => async (dispatch, getState) => {
    const isOverdue = date === null
    const allIds = [...isOverdue ? getState().plannerEvents.overdueIds : getState().daily.days[date].plannerEventIds]
    const [removed] = allIds.splice(startIndex, 1)
    allIds.splice(endIndex, 0, removed)
    if (isOverdue) {
      dispatch(reorderOverduePlannerEvents(allIds))
    } else {
      dispatch(updatePlannerEventIds({ date, ids: allIds }))
    }
    await plannerEventApi.reorder(allIds)
    if (isOverdue) {
      await dispatch(loadOverduePlannerEvents())
    } else {
      await dispatch(loadDayData(date))
    }
  }

export const setAndLoadToday = (date: Date) => (dispatch: (a: any) => any) => {
  const dateString = ymd(date)
  dispatch(setTodayDate(dateString))
  dispatch(loadDayData(dateString))
}

const initialState: DailyState = {
  todayDate: ymd(new Date()),
  days: {}
}

export interface NewPlannerEventUpdate {
  date: string
  content: string
}

const dayInitialState: (date: string) => DayState = date => ({
  date,
  status: 'loading',
  habitEventIds: [],
  plannerEventIds: [],
  deletedPlannerEventIds: [],
  waterGlassIds: [],
  newPlannerEvent: { content: '' }
})

const dailySlice = createSlice({
  name: 'daily',
  initialState: initialState,
  reducers: {
    setTodayDate (state: DailyState, { payload }: PayloadAction<string>) {
      state.todayDate = payload
      if (state.days[payload] !== undefined) {
        state.days[payload].status = 'loading'
      } else {
        state.days[payload] = dayInitialState(payload)
      }
    },
    updateNewPlannerEvent (state: DailyState, { payload }: PayloadAction<NewPlannerEventUpdate>) {
      state.days[payload.date].newPlannerEvent.content = payload.content
    },
    updatePlannerEventIds (state: DailyState, { payload }: PayloadAction<{ date: string, ids: number[] }>) {
      state.days[payload.date].plannerEventIds = payload.ids
    }
  },
  extraReducers: builder => {
    builder.addCase(loadDayData.pending, (state: DailyState, { meta: { arg } }) => {
      if (state.days[arg] !== undefined) {
        state.days[arg].status = 'loading'
      } else {
        state.days[arg] = dayInitialState(arg)
      }
    })
    builder.addCase(loadDayData.rejected, (state: DailyState, { meta: { arg } }) => {
      state.days[arg].status = 'failed'
    })
    builder.addCase(loadDayData.fulfilled, (state: DailyState, { payload }) => {
      const { date, habitEvents, plannerEvents, waterGlasses } = payload
      state.days[date].status = 'idle'
      state.days[date].habitEventIds = habitEvents.map(h => h.id)
      state.days[date].plannerEventIds = plannerEvents.map(p => p.id)
      state.days[date].waterGlassIds = waterGlasses.map(w => w.id)
    })
    builder.addCase(unsetPlannerEvent, (state: DailyState, { payload }) => {
      Object.values(state.days).forEach(dayState => {
        if (dayState.plannerEventIds.includes(payload)) {
          dayState.plannerEventIds = dayState.plannerEventIds.filter(id => id !== payload)
        }
      })
    })
    builder.addCase(loadPlannerEvents.fulfilled, (state: DailyState, { payload }) => {
      if (payload.length === 0) {
        return
      }

      const date = payload[0].eventDate
      if (state.days[date] === undefined) {
        state.days[date] = dayInitialState(date)
      }
      state.days[date].plannerEventIds = payload.map(it => it.id)
    })
    builder.addCase(bulkLoadPlannerEvents.fulfilled, (state: DailyState, { payload }) => {
      const dates = [...new Set(payload.map(e => e.eventDate))]
      dates.forEach(date => {
        if (state.days[date] === undefined) {
          state.days[date] = dayInitialState(date)
        }
        state.days[date].plannerEventIds = payload.filter(it => it.eventDate === date).map(it => it.id)
      })
    })
  }
})

export const { setTodayDate, updateNewPlannerEvent, updatePlannerEventIds } = dailySlice.actions
export default dailySlice
