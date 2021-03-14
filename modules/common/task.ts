import { ITaskItem } from './constants'

export const isTaskSizeIncreased = ({ image, optimized }: ITaskItem) => (
  optimized && optimized.size >= image.size
)
