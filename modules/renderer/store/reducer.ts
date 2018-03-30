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
  // TODO: if possible, change `string` to `SupportedExt`
  [key: string]: IOptimizeOptions
  jpg: IOptimizeOptions
  png: IOptimizeOptions
  webp: IOptimizeOptions
}

interface IGlobals {
  activeId?: string
  updateInfo?: IUpdateInfo
  imageMagickInstalled: boolean
  optionsVisible: boolean
  defaultOptions: IDefaultOptions
}

export interface IState {
  tasks: ITaskItem[]
  globals: IGlobals
}

export const newOptimizeOptions = (ext: SupportedExt) => {
  const optimizeOptions: IOptimizeOptions = {
    exportExt: ext,
  }

  switch (ext) {
    case SupportedExt.jpg:
    case SupportedExt.webp:
      Object.assign(optimizeOptions, {
        quality: 80,
      })
      break

    case SupportedExt.png:
      Object.assign(optimizeOptions, {
        color: 128,
      })
      break
  }

  return optimizeOptions
}

const savedOptions = storage.getOptions()

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

export const taskReducer = handleActions<Tasks, any>({
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
    const defaultOptions = action.payload!
    return state.map(item => {
      const exportExt = defaultOptions[item.image.ext].exportExt!
      return {
        ...item,
        options: defaultOptions[exportExt] || newOptimizeOptions(exportExt),
        status: TaskStatus.PENDING,
      }
    })
  },
}, [])

export const globalsReducer = handleActions<IGlobals, any>({
  [ACTIONS.TASK_SELECTED_ID_UPDATE](state, action: Action<string>) {
    return {
      ...state,
      activeId: action.payload,
    }
  },

  [ACTIONS.APP_UPDATABLE](state, action: Action<IUpdateInfo>) {
    return {
      ...state,
      updateInfo: action.payload,
    }
  },

  [ACTIONS.OPTIONS_VISIBLE_UPDATE](state, action: Action<boolean>) {
    return {
      ...state,
      optionsVisible: action.payload!,
    }
  },

  [ACTIONS.DEFAULT_OPTIONS_UPDATE](state, action: Action<IDefaultOptionsPayload>) {
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

  [ACTIONS.IMAGEMAGICK_CHECKED_UPDATE](state, action: Action<boolean>) {
    return {
      ...state,
      imageMagickInstalled: action.payload!,
    }
  },
}, {
  optionsVisible: false,
  imageMagickInstalled: false,
  defaultOptions: {
    png: newOptimizeOptions(SupportedExt.png),
    jpg: newOptimizeOptions(SupportedExt.jpg),
    webp: newOptimizeOptions(SupportedExt.webp),
  },
  ...savedOptions,
})

export default combineReducers<IState>({
  tasks: taskReducer,
  globals: globalsReducer,
})
