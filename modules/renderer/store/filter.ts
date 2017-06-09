import { ITaskItem } from '../../common/constants'
import { State } from './reducer'

export const getTaskById = (tasks: ITaskItem[], id: string) => {
  return tasks.find(task => task.id === id)
}
