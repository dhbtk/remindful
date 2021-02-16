import { Task } from './common'
import { createReducer } from '@reduxjs/toolkit'
import { formatISO } from 'date-fns'
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

export interface TasksState {
  entities: { [id: number]: Task }
  overdueIds: number[]
}

export const completeTask: (id: number) => AppThunk = (id) => async (dispatch, getState) => {
  const task = getState().tasks.entities[id]
  const updatedTask: Task = { ...task, status: 'done', actedAt: formatISO(new Date()) }
  dispatch(setTask(updatedTask))
  await taskApi.update(updatedTask)
}

export const dismissTask: (id: number) => AppThunk = (id) => async (dispatch, getState) => {
  const task = getState().tasks.entities[id]
  const updatedTask: Task = { ...task, status: 'dismissed', actedAt: formatISO(new Date()) }
  dispatch(setTask(updatedTask))
  await taskApi.update(updatedTask)
}

export const undoCompleteTask: (id: number) => AppThunk = (id) => async (dispatch, getState) => {
  const task = getState().tasks.entities[id]
  const updatedTask: Task = { ...task, status: 'pending', actedAt: null }
  dispatch(setTask(updatedTask))
  await taskApi.update(updatedTask)
}

export const deleteTask: (id: number) => AppThunk = id => async (dispatch, getState) => {
  dispatch(unsetTask(id))
  await taskApi.destroy(id)
}

const initialState: TasksState = { entities: {}, overdueIds: [] }

const tasks = createReducer(initialState, builder => {
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
})

export default tasks
