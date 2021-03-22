import { Task } from './common'
import { createReducer } from '@reduxjs/toolkit'
import { formatISO } from 'date-fns'
import taskApi from '../api/taskApi'
import { AppDispatch, AppThunk } from './index'
import {
  bulkLoadTasks,
  loadDayData,
  loadOverdueTasks,
  loadTasks,
  reorderOverdueTasks, resetState,
  setTask,
  unsetTask
} from './commonActions'
import { RootState } from './rootReducer'

export interface TasksState {
  entities: { [id: number]: Task }
  overdueIds: number[]
}

async function updateAndReload (task: Task, dispatch: AppDispatch, getState: () => RootState): Promise<void> {
  dispatch(setTask(task))
  const isOverdue = getState().tasks.overdueIds.includes(task.id)
  if (isOverdue) {
    const newIds = getState().tasks.overdueIds.filter(it => it !== task.id)
    dispatch(reorderOverdueTasks(newIds))
  }
  await taskApi.update(task)
  if (isOverdue) {
    await dispatch(loadOverdueTasks())
  } else {
    await dispatch(loadTasks(task.eventDate))
  }
}

export const completeTask: (id: number) => AppThunk = (id) => async (dispatch, getState) => {
  const task = getState().tasks.entities[id]
  const updatedTask: Task = { ...task, status: 'done', actedAt: formatISO(new Date()) }
  await updateAndReload(updatedTask, dispatch, getState)
}

export const dismissTask: (id: number) => AppThunk = (id) => async (dispatch, getState) => {
  const task = getState().tasks.entities[id]
  const updatedTask: Task = { ...task, status: 'dismissed', actedAt: formatISO(new Date()) }
  await updateAndReload(updatedTask, dispatch, getState)
}

export const undoCompleteTask: (id: number) => AppThunk = (id) => async (dispatch, getState) => {
  const task = getState().tasks.entities[id]
  const updatedTask: Task = { ...task, status: 'pending', actedAt: null }
  await updateAndReload(updatedTask, dispatch, getState)
}

export const deleteTask: (id: number) => AppThunk = id => async (dispatch, getState) => {
  dispatch(unsetTask(id))
  await taskApi.destroy(id)
}

const initialState: TasksState = { entities: {}, overdueIds: [] }

const tasks = createReducer(initialState, builder => {
  builder.addCase(resetState, () => ({ ...initialState }))
  builder.addCase(loadDayData.fulfilled, (state: TasksState, { payload }) => {
    payload.tasks.forEach(task => {
      state.entities[task.id] = task
    })
  })
  builder.addCase(loadTasks.fulfilled, (state: TasksState, { payload }) => {
    payload.forEach(task => {
      state.entities[task.id] = task
    })
  })
  builder.addCase(setTask, (state: TasksState, { payload }) => {
    state.entities[payload.id] = payload
    if (payload.status === 'done' && state.overdueIds.includes(payload.id)) {
      state.overdueIds = state.overdueIds.filter(it => it !== payload.id)
    }
  })
  builder.addCase(bulkLoadTasks.fulfilled, (state: TasksState, { payload }) => {
    payload.forEach(task => {
      state.entities[task.id] = task
    })
  })
  builder.addCase(loadOverdueTasks.fulfilled, (state: TasksState, { payload }) => {
    payload.forEach(task => {
      state.entities[task.id] = task
    })
    state.overdueIds = payload.map(it => it.id)
  })
  builder.addCase(reorderOverdueTasks, (state: TasksState, { payload }) => {
    state.overdueIds = payload
  })
  builder.addCase(unsetTask, (state: TasksState, { payload }) => {
    state.overdueIds = state.overdueIds.filter(id => id !== payload)
  })
})

export default tasks
