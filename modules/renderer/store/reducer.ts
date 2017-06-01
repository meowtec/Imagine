import { ipcRenderer } from 'electron'
import { Reducer, combineReducers } from 'redux'
import { handleActions, Action } from 'redux-actions'
import { ImageFile, OptimizeOptions, TaskItem, TaskStatus } from '../../common/constants'
import { ACTIONS } from './actions'
import deamon from './daemon'

type Tasks = TaskItem[]

export interface State {
  tasks: TaskItem[]
}

const newOptimizeOptions: () => OptimizeOptions = () => ({
  color: 64,
})

const updateTaskHelper = (tasks: Tasks, id: string, partial: Partial<TaskItem>) => {
  const index = tasks.findIndex(task => task.image.id === id)
  if (index === -1) return tasks

  return [
    ...tasks.slice(0, index),
    {
      ...tasks[index],
      ...partial,
    },
    ...tasks.slice(index + 1),
  ]
}

export const taskReducer: Reducer<Tasks> = handleActions<Tasks>({
  [ACTIONS.TASK_ADD] (state, action: Action<ImageFile[]>) {
    return [
      ...state,
      ...action.payload
        .filter(image => !state.some(task => task.image.id === image.id))
        .map<TaskItem>(image => ({
          image,
          options: newOptimizeOptions(),
          status: TaskStatus.PENDING,
        }))
    ]
  },

  [ACTIONS.TASK_DELETE] (state, action: Action<string[]>) {
    return state.filter(task => !action.payload.some(id => id === task.image.id))
  },

  [ACTIONS.TASK_CLEAR] (state, action: Action<void>) {
    return []
  },

  [ACTIONS.TASK_UPDATE_OPTIONS] (state, action: Action<{ id: string, options: OptimizeOptions }>) {
    const { id, options } = action.payload
    return updateTaskHelper(state, id, {
      options,
      status: TaskStatus.PENDING,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_START] (state, action: Action<string>) {
    const id = action.payload
    return updateTaskHelper(state, id, {
      status: TaskStatus.PROCESSING,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_SUCCESS] (state, action: Action<{ id: string, optimized: ImageFile }>) {
    const { id, optimized } = action.payload
    return updateTaskHelper(state, id, {
      optimized,
      status: TaskStatus.DONE,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_FAIL] (state, action: Action<string>) {
    const id = action.payload
    return updateTaskHelper(state, id, {
      status: TaskStatus.FAIL,
      optimized: null,
    })
  },
}, [])

export default combineReducers<State>({
  tasks: taskReducer,
})
