import { Store } from 'redux'
import { IState } from './reducer'
import { createAction, Action } from 'redux-actions'
import {
  ACTIONS,
  ITaskAddPayloadItem,
  IDefaultOptionsPayload,
} from './actions'
import {
  IImageFile,
  IOptimizeOptions,
  ITaskItem,
  TaskStatus,
  IUpdateInfo,
  SupportedExt,
} from '../../common/constants'

let store: Store<IState> | undefined

export function setStore(_store: Store<IState>) {
  store = _store
}

export default {
  $store: null as number | null,

  taskAdd: createAction<ITaskAddPayloadItem[], IImageFile[]>(
    ACTIONS.TASK_ADD,
    (items: IImageFile[]) => {
    const { defaultOptions } = store!.getState().globals

    return items.map(item => ({
      image: item,
      options: defaultOptions[item.ext],
    }))
  }),

  taskDelete: createAction<string[]>(ACTIONS.TASK_DELETE),

  taskClear: createAction(ACTIONS.TASK_CLEAR),

  taskUpdateOptions: createAction<{ id: string, options: IOptimizeOptions }, string, IOptimizeOptions>
    (ACTIONS.TASK_UPDATE_OPTIONS, (id, options) => ({ id, options })),

  taskOptimizeStart: createAction<string>(ACTIONS.TASK_OPTIMIZE_START),

  taskOptimizeSuccess: createAction<{ id: string, optimized: IImageFile }, string, IImageFile>
    (ACTIONS.TASK_OPTIMIZE_SUCCESS, (id, optimized) => ({ id, optimized })),

  taskOptimizeFail: createAction<string>(ACTIONS.TASK_OPTIMIZE_FAIL),

  taskDetail: createAction<string | null>(ACTIONS.TASK_DETAIL),

  appUpdateInfo: createAction<IUpdateInfo>(ACTIONS.APP_CAN_UPDATE),

  optionsVisible: createAction<boolean>(ACTIONS.OPTIONS_VISIBLE),

  defaultOptions: createAction<IDefaultOptionsPayload>(ACTIONS.DEFAULT_OPTIONS),

  optionsApply: createAction(ACTIONS.OPTIONS_APPLY, () => {
    return store!.getState().globals.defaultOptions
  }),

  imageMagickInstalled: createAction<boolean>(ACTIONS.IMAGEMAGICK_CHECKED),
}
