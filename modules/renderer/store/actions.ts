import { createAction, Action } from 'redux-actions'
import { Enum } from 'typescript-string-enums'
import { ImageFile, OptimizeOptions, TaskItem, TaskStatus } from '../../common/constants'

export const ACTIONS = Enum(
  'TASK_ADD',
  'TASK_DELETE',
  'TASK_CLEAR',
  'TASK_UPDATE_OPTIONS',
  'TASK_OPTIMIZE_START',
  'TASK_OPTIMIZE_SUCCESS',
  'TASK_OPTIMIZE_FAIL',
)

export const actions = {
  taskAdd: createAction<ImageFile[]>(ACTIONS.TASK_ADD),

  taskDelete: createAction<string[]>(ACTIONS.TASK_DELETE),

  taskClear: createAction<void>(ACTIONS.TASK_CLEAR),

  taskUpdateOptions: createAction<{ id: string, options: OptimizeOptions }, string, OptimizeOptions>
    (ACTIONS.TASK_UPDATE_OPTIONS, (id, options) => ({ id, options })),

  taskOptimizeStart: createAction<string>(ACTIONS.TASK_OPTIMIZE_START),

  taskOptimizeSuccess: createAction<{ id: string, optimized: ImageFile }, string, ImageFile>
    (ACTIONS.TASK_OPTIMIZE_SUCCESS, (id, optimized) => ({ id, optimized })),

  taskOptimizeFail: createAction<string>(ACTIONS.TASK_OPTIMIZE_FAIL),
}

const z = createAction<string>('AA')
const k = createAction('ZZZ')
const kk = k()
