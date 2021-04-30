import { createSelector } from 'reselect'
import { IState } from '../../common/types'

export const getTasks = (state: IState) => state.tasks
export const getActiveId = (state: IState) => state.globals.activeId

export const getActiveTask = createSelector(
  getTasks,
  getActiveId,
  (tasks, id) => tasks.find((task) => task.id === id),
)
