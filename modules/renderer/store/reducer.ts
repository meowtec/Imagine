import { Reducer, combineReducers } from 'redux'
import { handleActions, Action } from 'redux-actions'
import * as storage from './storage'
import {
  IImageFile,
  IOptimizeOptions,
  ITaskItem,
  TaskStatus,
  IUpdateInfo,
  SupportedExt,
} from '../../common/constants'
import {
  ACTIONS,
  ITaskAddPayloadItem,
  IDefaultOptionsPayload,
} from './actions'

type Tasks = ITaskItem[]

export interface IDefaultOptions {
  jpg: IOptimizeOptions
  png: IOptimizeOptions
}

interface IGlobals {
  activeId: string | null
  updateInfo?: IUpdateInfo
  imageMagickInstalled: boolean
  optionsVisible: boolean
  defaultOptions: IDefaultOptions
}

export interface IState {
  tasks: ITaskItem[]
  globals: IGlobals
}

const newOptimizeOptions = () => ({
  color: 128,
  quality: 70,
})

const savedDefaultOptions = storage.getOptions()

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
  [ACTIONS.TASK_ADD](state, action: Action<ITaskAddPayloadItem[]>) {
    return [
      ...state,
      ...action.payload!
        .filter(item => !state.some(task => task.id === item.image.id))
        .map<ITaskItem>(item => ({
          id: item.image.id,
          image: item.image,
          options: item.options,
          status: TaskStatus.PENDING,
        })),
    ]
  },

  [ACTIONS.TASK_DELETE](state, action: Action<string[]>) {
    return state.filter(task => !action.payload!.some(id => id === task.id))
  },

  [ACTIONS.TASK_CLEAR](state, action: Action<void>) {
    return []
  },

  [ACTIONS.TASK_UPDATE_OPTIONS](state, action: Action<{ id: string, options: IOptimizeOptions }>) {
    const { id, options } = action.payload!
    return updateTaskHelper(state, id, {
      options,
      status: TaskStatus.PENDING,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_START](state, action: Action<string>) {
    const id = action.payload!
    return updateTaskHelper(state, id, {
      status: TaskStatus.PROCESSING,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_SUCCESS](state, action: Action<{ id: string, optimized: IImageFile }>) {
    const { id, optimized } = action.payload!
    return updateTaskHelper(state, id, {
      optimized,
      status: TaskStatus.DONE,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_FAIL](state, action: Action<string>) {
    const id = action.payload!
    return updateTaskHelper(state, id, {
      status: TaskStatus.FAIL,
    })
  },

  [ACTIONS.OPTIONS_APPLY](state, action: Action<IDefaultOptions>) {
    return state.map(item => {
      return {
        ...item,
        options: action.payload![item.image.ext],
        status: TaskStatus.PENDING,
      }
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

  [ACTIONS.APP_CAN_UPDATE](state, action: Action<IUpdateInfo>) {
    return {
      ...state,
      updateInfo: action.payload,
    }
  },

  [ACTIONS.OPTIONS_VISIBLE](state, action: Action<boolean>) {
    return {
      ...state,
      optionsVisible: action.payload,
    }
  },

  [ACTIONS.DEFAULT_OPTIONS](state, action: Action<IDefaultOptionsPayload>) {
    const { ext, options } = action.payload!
    const defaultOptions = {
      ...state.defaultOptions,
      [ext]: options,
    }

    /**
     * save to localStorage
     */
    storage.saveOptions({defaultOptions})

    return {
      ...state,
      defaultOptions,
    }
  },

  [ACTIONS.IMAGEMAGICK_CHECKED](state, action: Action<boolean>) {
    return {
      ...state,
      imageMagickInstalled: action.payload,
    }
  },
}, {
  activeId: null,
  optionsVisible: false,
  imageMagickInstalled: false,
  defaultOptions: {
    png: newOptimizeOptions(),
    jpg: newOptimizeOptions(),
  },
  ...savedDefaultOptions,
})

export default combineReducers<IState>({
  tasks: taskReducer,
  globals: globalsReducer,
})
