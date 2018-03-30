import { Store } from 'redux'
import { IState, newOptimizeOptions } from './reducer'
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

    return items.map(item => {
      const exportExt = (
        defaultOptions[item.ext] &&
        defaultOptions[item.ext].exportExt ||
        item.ext
      )

      return {
        image: item,
        options: {
          ...(defaultOptions[exportExt] || newOptimizeOptions(exportExt)),
          exportExt,
        },
      }
    })
  }),

  taskDelete: createAction<string[]>(ACTIONS.TASK_DELETE),

  taskClear: createAction(ACTIONS.TASK_CLEAR),

  taskUpdateOptions: createAction<{
    id: string
    options: IOptimizeOptions
  }, string, IOptimizeOptions>(
    ACTIONS.TASK_UPDATE_OPTIONS,
    (id, options) => ({ id, options })
  ),

  taskUpdateExport: createAction<{
    id: string
    options: IOptimizeOptions
  }, string, SupportedExt>(
    ACTIONS.TASK_UPDATE_OPTIONS,
    (id, ext) => {
      const { defaultOptions } = store!.getState().globals

      return {
        id,
        options: defaultOptions[ext] || newOptimizeOptions(ext),
      }
    }
  ),

  taskOptimizeStart: createAction<string>(ACTIONS.TASK_OPTIMIZE_START),

  taskOptimizeSuccess: createAction<{ id: string, optimized: IImageFile }, string, IImageFile>
    (ACTIONS.TASK_OPTIMIZE_SUCCESS, (id, optimized) => ({ id, optimized })),

  taskOptimizeFail: createAction<string>(ACTIONS.TASK_OPTIMIZE_FAIL),

  taskDetail: createAction<string | null>(ACTIONS.TASK_SELECTED_ID_UPDATE),

  appUpdateInfo: createAction<IUpdateInfo>(ACTIONS.APP_UPDATABLE),

  optionsVisible: createAction<boolean>(ACTIONS.OPTIONS_VISIBLE_UPDATE),

  defaultOptions: createAction<IDefaultOptionsPayload>(ACTIONS.DEFAULT_OPTIONS_UPDATE),

  optionsApply: createAction(ACTIONS.OPTIONS_APPLY, () =>
    store!.getState().globals.defaultOptions
  ),

  imageMagickInstalled: createAction<boolean>(ACTIONS.IMAGEMAGICK_CHECKED_UPDATE),
}
