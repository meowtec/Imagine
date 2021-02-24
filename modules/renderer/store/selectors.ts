import { createSelector } from 'reselect'
import { ITaskItem } from '../../common/constants'
import { IState } from './reducer'

export const getTasks = (state: IState) => state.tasks
export const getActiveId = (state: IState) => state.globals.activeId

export const getActiveTask = createSelector(
  getTasks,
  getActiveId,
  (tasks, id) => tasks.find((task) => task.id === id),
)
