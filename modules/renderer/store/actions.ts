import { createAction, Action } from 'redux-actions'
import { Enum } from 'typescript-string-enums'
import { IImageFile, IOptimizeOptions, ITaskItem, TaskStatus, IUpdateInfo } from '../../common/constants'

export const ACTIONS = Enum(
  'TASK_ADD',
  'TASK_DELETE',
  'TASK_CLEAR',
  'TASK_UPDATE_OPTIONS',
  'TASK_OPTIMIZE_START',
  'TASK_OPTIMIZE_SUCCESS',
  'TASK_OPTIMIZE_FAIL',
  'TASK_DETAIL',
  'APP_CAN_UPDATE',
)

export const actions = {
  taskAdd: createAction<IImageFile[]>(ACTIONS.TASK_ADD),

  taskDelete: createAction<string[]>(ACTIONS.TASK_DELETE),

  taskClear: createAction(ACTIONS.TASK_CLEAR),

  taskUpdateOptions: createAction<{ id: string, options: IOptimizeOptions }, string, IOptimizeOptions>
    (ACTIONS.TASK_UPDATE_OPTIONS, (id, options) => ({ id, options })),

  taskOptimizeStart: createAction<string>(ACTIONS.TASK_OPTIMIZE_START),

  taskOptimizeSuccess: createAction<{ id: string, optimized: IImageFile }, string, IImageFile>
    (ACTIONS.TASK_OPTIMIZE_SUCCESS, (id, optimized) => ({ id, optimized })),

  taskOptimizeFail: createAction<string>(ACTIONS.TASK_OPTIMIZE_FAIL),

  taskDetail: createAction<string>(ACTIONS.TASK_DETAIL),

  appUpdateInfo: createAction<IUpdateInfo>(ACTIONS.APP_CAN_UPDATE),
}
