import { Enum } from 'typescript-string-enums'

export const SupportedExt = Enum('png', 'jpg')
export type SupportedExt = Enum<typeof SupportedExt>

export const TaskStatus = Enum('PENDING', 'PROCESSING', 'DONE', 'FAIL')
export type TaskStatus = Enum<typeof TaskStatus>

export const IpcChannel = Enum('FILE_SELECT', 'FILE_SELECTED', 'FILE_ADD', 'OPTIMIZE')
export type IpcChannel = Enum<typeof IpcChannel>

export interface ElectronResponse<T> {
  session: string
  error: string
  result: T
}

export interface ImageFile {
  id: string
  url: string
  size: number
  ext: string
  color: number
  originalName: string
}

export interface OptimizeOptions {
  color?: number
  quality?: number
}

export interface TaskItem {
  image: ImageFile
  options: OptimizeOptions
  optimized?: ImageFile
  status: TaskStatus
}

export interface OptimizeRequest {
  image: ImageFile
  options: OptimizeOptions
}
