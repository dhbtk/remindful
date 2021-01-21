import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { HabitEvent, LoadStatus, PlannerEvent, WaterGlass } from './common'
import { format } from 'date-fns'
import plannerEventApi from '../api/plannerEventApi'
import { AppThunk } from './index'
import { loadDayData, loadPlannerEvents, setPlannerEvent, unsetPlannerEvent } from './commonActions'

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

export const saveNewPlannerEvent: (date: string) => AppThunk = (date) => async (dispatch, getState) => {
  const dailyData = getState().daily
  const planners = getState().plannerEvents
  const tempId = Math.max(...Object.values(planners.entities).map(p => p.id)) + 1
  const newPlanner: PlannerEvent = {
    id: tempId,
    eventDate: date,
    status: 'pending',
    actedAt: null,
    content: dailyData.days[date].newPlannerEvent.content
  }
  dispatch(setPlannerEvent(newPlanner))
  dispatch(updateNewPlannerEvent({ date, content: '' }))
  await plannerEventApi.create(newPlanner)
  await dispatch(loadDayData(date))
}

export const reorderPlannerEvents: (date: string, startIndex: number, endIndex: number) => AppThunk =
  (date, startIndex, endIndex) => async (dispatch, getState) => {
    const allIds = getState().daily.days[date].plannerEventIds
    const currentIds = allIds.filter(id => getState().plannerEvents.entities[id].status === 'pending')
    const doneIds = allIds.filter(id => getState().plannerEvents.entities[id].status !== 'pending')
    const [removed] = currentIds.splice(startIndex, 1)
    currentIds.splice(endIndex, 0, removed)
    dispatch(updatePlannerEventIds({ date, ids: currentIds.concat(doneIds) }))
    await plannerEventApi.reorder(currentIds)
    await dispatch(loadDayData(date))
  }

export const setAndLoadToday = (date: Date) => (dispatch: (a: any) => any) => {
  const dateString = format(date, 'yyyy-MM-dd')
  dispatch(setTodayDate(dateString))
  dispatch(loadDayData(dateString))
}

const initialState: DailyState = {
  todayDate: format(new Date(), 'yyyy-MM-dd'),
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
      const date = payload[0].eventDate
      if (state.days[date] === undefined) {
        state.days[date] = dayInitialState(date)
      }
      state.days[date].plannerEventIds = payload.map(it => it.id)
    })
  }
})

export const { setTodayDate, updateNewPlannerEvent, updatePlannerEventIds } = dailySlice.actions
export default dailySlice
