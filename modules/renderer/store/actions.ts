import store from './store'
import { createAction, Action } from 'redux-actions'
import { Enum } from 'typescript-string-enums'
import {
  IImageFile,
  IOptimizeOptions,
  ITaskItem,
  TaskStatus,
  IUpdateInfo,
  SupportedExt,
} from '../../common/constants'

export interface ITaskAddPayloadItem {
  image: IImageFile
  options: IOptimizeOptions
}

export interface IDefaultOptionsPayload {
  ext: SupportedExt
  options: IOptimizeOptions
}

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
  'OPTIONS_VISIBLE',
  'DEFAULT_OPTIONS',
  'OPTIONS_APPLY',
)
