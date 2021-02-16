import { Task } from '../store/common'
import { apiDelete, apiGet, apiPatch, apiPost, unwrap } from './fetchWrappers'

const taskApi = {
  forDate: async (date: string): Promise<Task[]> => {
    return await apiGet<Task[]>('/api/tasks', { date }).then(unwrap)
  },
  forDates: async (dates: string[]): Promise<Task[]> => {
    return await apiGet<Task[]>('/api/tasks', { date: dates }).then(unwrap)
  },
  overdue: async (): Promise<Task[]> => {
    return await apiGet<Task[]>('/api/tasks', { overdue: 'true' }).then(unwrap)
  },
  create: async (task: Task): Promise<void> => {
    await apiPost('/api/tasks', { task: task })
  },
  reorder: async (ids: number[]): Promise<void> => {
    await apiPost('/api/tasks/reorder', { ids })
  },
  update: async (task: Partial<Task> & Pick<Task, 'id'>): Promise<void> => {
    await apiPatch(`/api/tasks/${task.id}`, { task: task })
  },
  destroy: async (id: number): Promise<void> => {
    await apiDelete(`/api/tasks/${id}`)
  }
}

export default taskApi