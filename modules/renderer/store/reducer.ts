import { Reducer } from 'redux'
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
  optionsVisible: boolean
  defaultOptions: IDefaultOptions
}

export interface IState {
  tasks: ITaskItem[]
  globals: IGlobals
}

export const createOptimizeOptions = (ext: SupportedExt) => {
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

function updateTaskItem(state: IState, id: string, partial: Partial<ITaskItem>): IState {
  return updateTaskList(state, (tasks) => {
    const index = tasks.findIndex((task) => task.id === id)
    if (index === -1) return tasks
    return [
      ...tasks.slice(0, index),
      {
        ...tasks[index],
        ...partial,
      },
      ...tasks.slice(index + 1),
    ]
  })
}

function updateTaskList(state: IState, updater: (task: Tasks) => Tasks): IState {
  return {
    ...state,
    tasks: updater(state.tasks),
  }
}

function updateGlobals(state: IState, updater: (globals: IGlobals) => IGlobals): IState {
  return {
    ...state,
    globals: updater(state.globals),
  }
}

function updateGlobalsPartial(state: IState, updater: Partial<IGlobals>): IState {
  return updateGlobals(state, (globals) => ({
    ...globals,
    ...updater,
  }))
}

function getInitialTaskOptions(exportExt: SupportedExt, defaultOptions: IDefaultOptions) {
  return {
    ...(defaultOptions[exportExt] || createOptimizeOptions(exportExt)),
    exportExt,
  }
}

export default handleActions<IState, any>({
  [ACTIONS.TASK_ADD](state, action: Action<IImageFile[]>) {
    const { defaultOptions } = state.globals

    return updateTaskList(state, (tasks) => [
      ...tasks,
      ...action.payload!
        .filter((image) => !tasks.some((task) => task.id === image.id))
        .map<ITaskItem>((image) => {
        const exportExt = (
          defaultOptions[image.ext]
            && defaultOptions[image.ext].exportExt
            || image.ext
        )

        return {
          id: image.id,
          image,
          options: getInitialTaskOptions(exportExt, defaultOptions),
          status: TaskStatus.PENDING,
        }
      }),
    ])
  },

  [ACTIONS.TASK_DELETE](state, action: Action<string[]>) {
    return updateTaskList(state, (tasks) => tasks.filter((task) => !action.payload!.some((id) => id === task.id)))
  },

  [ACTIONS.TASK_CLEAR](state, action: Action<void>) {
    return updateTaskList(state, () => [])
  },

  [ACTIONS.TASK_UPDATE_OPTIONS](state, action: Action<{ id: string, options: IOptimizeOptions }>) {
    const { id, options } = action.payload!

    return updateTaskItem(state, id, {
      options,
      status: TaskStatus.PENDING,
    })
  },

  [ACTIONS.TASK_UPDATE_EXPORT](state, action: Action<{ id: string, exportExt: SupportedExt }>) {
    const { id, exportExt } = action.payload!
    const { defaultOptions } = state.globals

    return updateTaskItem(state, id, {
      options: getInitialTaskOptions(exportExt, defaultOptions),
      status: TaskStatus.PENDING,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_START](state, action: Action<string>) {
    const id = action.payload!
    return updateTaskItem(state, id, {
      status: TaskStatus.PROCESSING,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_SUCCESS](state, action: Action<{ id: string, optimized: IImageFile }>) {
    const { id, optimized } = action.payload!
    return updateTaskItem(state, id, {
      optimized,
      status: TaskStatus.DONE,
    })
  },

  [ACTIONS.TASK_OPTIMIZE_FAIL](state, action: Action<string>) {
    const id = action.payload!
    return updateTaskItem(state, id, {
      status: TaskStatus.FAIL,
    })
  },

  [ACTIONS.OPTIONS_APPLY](state) {
    const { defaultOptions } = state.globals

    return updateTaskList(state, (list) => list.map((item) => {
      const exportExt = defaultOptions[item.image.ext].exportExt!
      return {
        ...item,
        options: getInitialTaskOptions(exportExt, defaultOptions),
        status: TaskStatus.PENDING,
      }
    }))
  },

  [ACTIONS.TASK_SELECTED_ID_UPDATE](state, action: Action<string>) {
    return updateGlobalsPartial(state, {
      activeId: action.payload,
    })
  },

  [ACTIONS.APP_UPDATABLE](state, action: Action<IUpdateInfo>) {
    return updateGlobalsPartial(state, {
      updateInfo: action.payload,
    })
  },

  [ACTIONS.OPTIONS_VISIBLE_UPDATE](state, action: Action<boolean>) {
    return updateGlobalsPartial(state, {
      optionsVisible: action.payload!,
    })
  },

  [ACTIONS.DEFAULT_OPTIONS_UPDATE](state, action: Action<IDefaultOptionsPayload>) {
    const { ext, options } = action.payload!
    const defaultOptions = {
      ...state.globals.defaultOptions,
      [ext]: options,
    }

    /**
     * save to localStorage
     */
    storage.saveOptions({ defaultOptions })

    return updateGlobalsPartial(state, {
      defaultOptions,
    })
  },
}, {
  tasks: [],
  globals: {
    optionsVisible: false,
    defaultOptions: {
      png: createOptimizeOptions(SupportedExt.png),
      jpg: createOptimizeOptions(SupportedExt.jpg),
      webp: createOptimizeOptions(SupportedExt.webp),
    },
    ...savedOptions,
  },
}) as Reducer<IState, any>
