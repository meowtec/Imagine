import { TaskItem } from '../../common/constants'
import { State } from './reducer'

export const getTaskById = (tasks: TaskItem[], id: string) => {
  return tasks.find(task => task.image.id === id)
}
