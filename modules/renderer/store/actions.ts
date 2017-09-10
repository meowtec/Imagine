import store from './store'
import { createAction, Action } from 'redux-actions'
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

export const enum ACTIONS {
  TASK_ADD = 'TASK_ADD',
  TASK_DELETE = 'TASK_DELETE',
  TASK_CLEAR = 'TASK_CLEAR',
  TASK_UPDATE_OPTIONS = 'TASK_UPDATE_OPTIONS',
  TASK_OPTIMIZE_START = 'TASK_OPTIMIZE_START',
  TASK_OPTIMIZE_SUCCESS = 'TASK_OPTIMIZE_SUCCESS',
  TASK_OPTIMIZE_FAIL = 'TASK_OPTIMIZE_FAIL',
  TASK_DETAIL = 'TASK_DETAIL',
  APP_CAN_UPDATE = 'APP_CAN_UPDATE',
  OPTIONS_VISIBLE = 'OPTIONS_VISIBLE',
  DEFAULT_OPTIONS = 'DEFAULT_OPTIONS',
  OPTIONS_APPLY = 'OPTIONS_APPLY',
  IMAGEMAGICK_CHECKED = 'IMAGEMAGICK_CHECKED',
}
