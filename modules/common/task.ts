import { ITaskItem } from './types'

export const isTaskSizeIncreased = ({ image, optimized }: ITaskItem) => (
  optimized && optimized.size >= image.size
)
