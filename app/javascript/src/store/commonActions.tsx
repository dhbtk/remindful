import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { Task, WaterGlass } from './common'
import taskApi from '../api/taskApi'
import waterGlassApi from '../api/waterGlassApi'
import { DayData } from './daily'
import habitApi from '../api/habitApi'

export const unsetTask = createAction<number>('unsetTask')

export const setTask = createAction<Task>('setTask')

export const resetState = createAction('resetState')

export const loadDayData = createAsyncThunk('today/loadDayData', async (date: string) => {
  const [tasks, waterGlasses]: [Task[], WaterGlass[]] = await Promise.all([
    taskApi.forDate(date),
    waterGlassApi.forDate(date)
  ])
  const dayData: DayData = { date, tasks, waterGlasses }

  return dayData
})

export const loadTasks = createAsyncThunk('loadTasks', async (date: string) => {
  return await taskApi.forDate(date)
})

export const bulkLoadTasks = createAsyncThunk('bulkLoadTasks', async (dates: string[]) => {
  return await taskApi.forDates(dates)
})

export const loadOverdueTasks = createAsyncThunk('loadOverdueTasks', async () => {
  return await taskApi.overdue()
})

export const loadHabits = createAsyncThunk('loadHabits', async () => {
  return await habitApi.getAll()
})

export const loadHabitTasks = createAsyncThunk('loadHabitTasks', async (habitId: number) => {
  return await taskApi.forHabit(habitId)
})

export const reorderOverdueTasks = createAction<number[]>('reorderOverdueTasks')
