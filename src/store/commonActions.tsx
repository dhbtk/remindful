import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { HabitEvent, PlannerEvent, WaterGlass } from './common'
import habitEventApi from '../api/habitEventApi'
import plannerEventApi from '../api/plannerEventApi'
import waterGlassApi from '../api/waterGlassApi'
import { DayData } from './daily'

export const unsetPlannerEvent = createAction<number>('unsetPlannerEvent')

export const setPlannerEvent = createAction<PlannerEvent>('setPlannerEvent')

export const loadDayData = createAsyncThunk('today/loadDayData', async (date: string) => {
  const [habitEvents, plannerEvents, waterGlasses]: [HabitEvent[], PlannerEvent[], WaterGlass[]] = await Promise.all([
    habitEventApi.forDate(date),
    plannerEventApi.forDate(date),
    waterGlassApi.forDate(date)
  ])
  const dayData: DayData = { date, habitEvents, plannerEvents, waterGlasses }

  return dayData
})
