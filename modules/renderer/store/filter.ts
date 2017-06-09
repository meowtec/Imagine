import { ITaskItem } from '../../common/constants'
import { IState } from './reducer'

export const getTaskById = (tasks: ITaskItem[], id: string) => {
  return tasks.find(task => task.id === id)
}
