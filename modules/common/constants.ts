import { Enum } from 'typescript-string-enums'

export const SupportedExt = Enum('png', 'jpg')
export type SupportedExt = Enum<typeof SupportedExt>

export const TaskStatus = Enum('PENDING', 'PROCESSING', 'DONE', 'FAIL')
export type TaskStatus = Enum<typeof TaskStatus>

export const IpcChannel = Enum(
  'FILE_SELECT',
  'FILE_SELECTED',
  'FILE_ADD',
  'OPTIMIZE',
  'SAVE',
  'SAVED',
  'SYNC',
  'APP_UPDATE',
  'READY',
)
export type IpcChannel = Enum<typeof IpcChannel>

export const SaveType = Enum('OVER', 'NEW_NAME', 'NEW_DIR', 'SAVE_AS')
export type SaveType = Enum<typeof SaveType>

export interface IElectronResponse<T> {
  session: string
  error: string
  result: T
}

export interface IImageFile {
  id: string
  url: string
  size: number
  ext: SupportedExt
  originalName: string
}

export interface IOptimizeOptions {
  color?: number
  quality?: number
}

export interface ITaskItem {
  id: string
  image: IImageFile
  options: IOptimizeOptions
  optimized?: IImageFile
  status: TaskStatus
}

export interface IOptimizeRequest {
  image: IImageFile
  options: IOptimizeOptions
}

export interface IBackendState {
  taskCount: number
  aloneMode: boolean
}

export interface IUpdateInfo {
  path: string
  githubArtifactName: string
  releaseName: string
  releaseNotes: string
  releaseDate: string
  sha512: string
  stagingPercentage: number
  version: string
}
