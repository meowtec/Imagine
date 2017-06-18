import { Reducer, combineReducers } from 'redux'
import { handleActions, Action } from 'redux-actions'
import { IImageFile, IOptimizeOptions, ITaskItem, TaskStatus } from '../../common/constants'
import { ACTIONS } from './actions'
import deamon from './daemon'

type Tasks = ITaskItem[]

interface IGlobals {
  activeId: string
}

export interface IState {
  tasks: ITaskItem[]
  globals: IGlobals
}

const newIOptimizeOptions: () => IOptimizeOptions = () => ({
  color: 128,
  quality: 70,
})

const updateTaskHelper = (tasks: Tasks, id: string, partial: Partial<ITaskItem>) => {
  const index = tasks.findIndex(task => task.id === id)
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

export const taskReducer = handleActions<Tasks>({
  [ACTIONS.TASK_ADD](state, action: Action<IImageFile[]>) {
    return [
      ...state,
      ...action.payload
        .filter(image => !state.some(task => task.id === image.id))
        .map<ITaskItem>(image => ({
          id: image.id,
          image,
          options: newIOptimizeOptions(),
          status: TaskStatus.PENDING,
        })),
    ]
  },

  [ACTIONS.TASK_DELETE](state, action: Action<string[]>) {
    return state.filter(task => !action.payload.some(id => id === task.id))
  },

  [ACTIONS.TASK_CLEAR](state, action: Action<void>) {
    return []
  },

  [ACTIONS.TASK_UPDATE_OPTIONS](state, action: Action<{ id: string, options: IOptimizeOptions }>) {
    const { id, options } = action.payload
    return updateTaskHelper(state, id, {
      options,
      status: TaskStatus.PENDING,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_START](state, action: Action<string>) {
    const id = action.payload
    return updateTaskHelper(state, id, {
      status: TaskStatus.PROCESSING,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_SUCCESS](state, action: Action<{ id: string, optimized: IImageFile }>) {
    const { id, optimized } = action.payload
    return updateTaskHelper(state, id, {
      optimized,
      status: TaskStatus.DONE,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_FAIL](state, action: Action<string>) {
    const id = action.payload
    return updateTaskHelper(state, id, {
      status: TaskStatus.FAIL,
      optimized: null,
    })
  },
}, [])

export const globalsReducer = handleActions<IGlobals>({
  [ACTIONS.TASK_DETAIL](state, action: Action<string>) {
    return {
      ...state,
      activeId: action.payload,
    }
  },
}, {
  activeId: null,
})

export default combineReducers<IState>({
  tasks: taskReducer,
  globals: globalsReducer,
})
