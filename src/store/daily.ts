import {createAsyncThunk, createSlice, Dispatch, PayloadAction} from "@reduxjs/toolkit";
import {HabitEvent, LoadStatus, PlannerEvent, WaterGlass} from "./common";
import {format} from 'date-fns'
import habitEventApi from "../api/habitEventApi";
import plannerEventApi from "../api/plannerEventApi";
import waterGlassApi from "../api/waterGlassApi";
import {addPlannerEvent, PlannerEventsState} from "./plannerEvents";

export interface NewPlannerEvent {
  content: string
  date?: string
}

export interface DayState {
  date: string
  status: LoadStatus
  habitEventIds: number[]
  plannerEventIds: number[]
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

export const saveNewPlannerEvent = (date: string) => async (dispatch: (a: any) => any, getState: () => any) => {
  const dailyData = getState().daily as DailyState
  const planners = getState().plannerEvents as PlannerEventsState
  const tempId = Math.max(...Object.values(planners.entities).map(p => p.id)) + 1
  const newPlanner: PlannerEvent = {
    id: tempId,
    eventDate: date,
    status: 'pending',
    actedAt: null,
    content: dailyData.days[date].newPlannerEvent.content
  }
  dispatch(addPlannerEvent(newPlanner))
  dispatch(updateNewPlannerEvent({date, content: ''}))
  await plannerEventApi.create(newPlanner)
  dispatch(loadDayData(date))
}

export const reorderPlannerEvents = (date: string, startIndex: number, endIndex: number) => async (dispatch: (a: any) => any, getState: () => any) => {
  const currentIds = Array.from(getState().daily.days[date].plannerEventIds as number[])
  const [removed] = currentIds.splice(startIndex, 1)
  currentIds.splice(endIndex, 0, removed)
  dispatch(updatePlannerEventIds({ date, ids: currentIds }))
  await plannerEventApi.reorder(currentIds)
  dispatch(loadDayData(date))
}

export const loadDayData = createAsyncThunk('today/loadDayData', async (date: string) => {
  const [habitEvents, plannerEvents, waterGlasses] = await Promise.all([
    habitEventApi.forDate(date),
    plannerEventApi.forDate(date),
    waterGlassApi.forDate(date)
  ])

  return {date, habitEvents, plannerEvents, waterGlasses} as DayData
})

export const setAndLoadToday = (date: Date) => (dispatch: (a: any) => any) => {
  const dateString = format(date, 'yyyy-MM-dd')
  dispatch(setTodayDate(dateString))
  dispatch(loadDayData(dateString))
}

const dailyInitialState: DailyState = {
  todayDate: format(new Date(), 'yyyy-MM-dd'),
  days: {}
}

export interface NewPlannerEventUpdate {
  date: string
  content: string
}

const dailySlice = createSlice({
  name: 'daily',
  initialState: dailyInitialState,
  reducers: {
    setTodayDate(state: DailyState, {payload}: PayloadAction<string>) {
      state.todayDate = payload
      if (state.days[payload]) {
        state.days[payload].status = 'loading'
      } else {
        state.days[payload] = {
          date: payload,
          status: 'loading',
          habitEventIds: [],
          plannerEventIds: [],
          waterGlassIds: [],
          newPlannerEvent: {content: ''}
        }
      }
    },
    updateNewPlannerEvent(state: DailyState, {payload}: PayloadAction<NewPlannerEventUpdate>) {
      state.days[payload.date].newPlannerEvent.content = payload.content
    },
    updatePlannerEventIds(state: DailyState, {payload}: PayloadAction<{ date: string, ids: number[] }>) {
      state.days[payload.date].plannerEventIds = payload.ids
    }
  },
  extraReducers: builder => {
    builder.addCase(loadDayData.pending, (state: DailyState, {meta: {arg}}) => {
      if (state.days[arg]) {
        state.days[arg].status = 'loading'
      } else {
        state.days[arg] = {
          date: arg,
          status: 'loading',
          habitEventIds: [],
          plannerEventIds: [],
          waterGlassIds: [],
          newPlannerEvent: {content: ''}
        }
      }
    })
    builder.addCase(loadDayData.rejected, (state: DailyState, {meta: {arg}}) => {
      state.days[arg].status = 'failed'
    })
    builder.addCase(loadDayData.fulfilled, (state: DailyState, {payload}) => {
      const {date, habitEvents, plannerEvents, waterGlasses} = payload
      state.days[date].status = 'idle'
      state.days[date].habitEventIds = habitEvents.map(h => h.id)
      state.days[date].plannerEventIds = plannerEvents.map(p => p.id as number)
      state.days[date].waterGlassIds = waterGlasses.map(w => w.id)
    })
  }
})

export const {setTodayDate, updateNewPlannerEvent, updatePlannerEventIds} = dailySlice.actions
export default dailySlice
