import { ipcRenderer } from 'electron'
import store from '../store/store'
import {
  IpcChannel,
  IImageFile,
  SaveType,
  IOptimizeRequest,
  ITaskItem,
} from '../../common/constants'
import { requestCreater } from '../../ipc-bridge/renderer'
import { cleanupArray } from '../../common/utils'

export const fileAdd = (files: string[]) => ipcRenderer.send(IpcChannel.FILE_ADD, files)

export const fileSelect = () => ipcRenderer.send(IpcChannel.FILE_SELECT)

export const fileSave = (images: IImageFile[], type: SaveType) => ipcRenderer.send(IpcChannel.SAVE, images, type)

export const fileSaveAll = (type: SaveType) => {
  const images = cleanupArray(
    store.getState().tasks
      .map((task: ITaskItem) => task.optimized),
  )
  if (!images.length) return

  fileSave(images, type)
}

export const optimize = requestCreater<IOptimizeRequest, IImageFile>(IpcChannel.OPTIMIZE)
