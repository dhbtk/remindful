import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoadStatus, Task, WaterGlass } from './common'
import taskApi from '../api/taskApi'
import { AppThunk } from './index'
import {
  bulkLoadTasks,
  loadDayData,
  loadOverdueTasks,
  loadTasks,
  reorderOverdueTasks,
  setTask,
  unsetTask
} from './commonActions'
import { ymd } from '../ui/ymdUtils'
import { RootState } from './rootReducer'

export interface DayState {
  date: string
  status: LoadStatus
  taskIds: number[]
  deletedTaskIds: number[]
  waterGlassIds: number[]
}

export interface DailyState {
  todayDate: string
  days: { [date: string]: DayState }
}

export interface DayData {
  date: string
  tasks: Task[]
  waterGlasses: WaterGlass[]
}

export const saveNewTask: (date: string, content: string) => AppThunk = (date, content) => async (dispatch, getState) => {
  const planners = getState().tasks
  const tempId = (Object.values(planners.entities).length === 0) ? 1 : (Math.max(...Object.values(planners.entities).map(p => p.id)) + 1)
  const newTask: Task = {
    id: tempId,
    eventDate: date,
    status: 'pending',
    actedAt: null,
    content: content
  }
  dispatch(setTask(newTask))
  await taskApi.create(newTask)
  await dispatch(loadDayData(date))
}

export const updateTask: (data: Partial<Task> & Pick<Task, 'id' | 'eventDate'>) => AppThunk = data => async (dispatch, getState) => {
  const state: RootState = getState()
  const currentTask = state.tasks.entities[data.id]
  if (data.eventDate !== currentTask.eventDate) {
    const oldDayIds = state.daily.days[currentTask.eventDate]?.taskIds?.filter(id => id !== data.id) ?? []
    dispatch(updateTaskIds({ date: currentTask.eventDate, ids: oldDayIds }))
    if (state.daily.days[data.eventDate] !== undefined) {
      const newIds = [...state.daily.days[data.eventDate].taskIds, data.id]
      dispatch(updateTaskIds({ date: data.eventDate, ids: newIds }))
      await taskApi.reorder(newIds)
    }
  }
  const updatedTask: Task = { ...currentTask, ...data }
  dispatch(setTask(updatedTask))
  await taskApi.update(updatedTask)
  dispatch(loadTasks(data.eventDate)).catch(console.error)
  if (state.tasks.overdueIds.includes(data.id)) {
    dispatch(loadOverdueTasks()).catch(console.error)
  } else if (data.eventDate !== currentTask.eventDate) {
    dispatch(loadTasks(currentTask.eventDate)).catch(console.error)
  }
}

export const reorderTasks: (date: string | null, startIndex: number, endIndex: number) => AppThunk =
  (date, startIndex, endIndex) => async (dispatch, getState) => {
    const isOverdue = date === null
    const allIds = [...isOverdue ? getState().tasks.overdueIds : getState().daily.days[date].taskIds]
    const [removed] = allIds.splice(startIndex, 1)
    allIds.splice(endIndex, 0, removed)
    if (isOverdue) {
      dispatch(reorderOverdueTasks(allIds))
    } else {
      dispatch(updateTaskIds({ date, ids: allIds }))
    }
    await taskApi.reorder(allIds)
    if (isOverdue) {
      await dispatch(loadOverdueTasks())
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

const dayInitialState: (date: string) => DayState = date => ({
  date,
  status: 'loading',
  taskIds: [],
  deletedTaskIds: [],
  waterGlassIds: []
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
    updateTaskIds (state: DailyState, { payload }: PayloadAction<{ date: string, ids: number[] }>) {
      if (state.days[payload.date] === undefined) {
        state.days[payload.date] = dayInitialState(payload.date)
      }
      state.days[payload.date].taskIds = payload.ids
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
      const { date, tasks, waterGlasses } = payload
      state.days[date].status = 'idle'
      state.days[date].taskIds = tasks.map(p => p.id)
      state.days[date].waterGlassIds = waterGlasses.map(w => w.id)
    })
    builder.addCase(unsetTask, (state: DailyState, { payload }) => {
      Object.values(state.days).forEach(dayState => {
        if (dayState.taskIds.includes(payload)) {
          dayState.taskIds = dayState.taskIds.filter(id => id !== payload)
        }
      })
    })
    builder.addCase(loadTasks.fulfilled, (state: DailyState, { payload }) => {
      if (payload.length === 0) {
        return
      }

      const date = payload[0].eventDate
      if (state.days[date] === undefined) {
        state.days[date] = dayInitialState(date)
      }
      state.days[date].taskIds = payload.map(it => it.id)
    })
    builder.addCase(bulkLoadTasks.fulfilled, (state: DailyState, { payload }) => {
      const dates = [...new Set(payload.map(e => e.eventDate))]
      dates.forEach(date => {
        if (state.days[date] === undefined) {
          state.days[date] = dayInitialState(date)
        }
        state.days[date].taskIds = payload.filter(it => it.eventDate === date).map(it => it.id)
      })
    })
  }
})

export const { setTodayDate, updateTaskIds } = dailySlice.actions
export default dailySlice
