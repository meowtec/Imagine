import store from '../store/store'
import {
  IpcChannel,
  IImageFile,
  SaveType,
  ITaskItem,
} from '../../common/types'
import { cleanupArray } from '../../common/utils'
import { imagineAPI } from '../../bridge/web'

export const fileAdd = (files: string[]) => imagineAPI.ipcSend(IpcChannel.FILE_ADD, files)

export const fileSelect = () => imagineAPI.ipcSend(IpcChannel.FILE_SELECT, null)

export const fileSave = (images: IImageFile[], type: SaveType) => imagineAPI.ipcSend(IpcChannel.SAVE, { images, type })

export const fileSaveAll = (type: SaveType) => {
  const images = cleanupArray(
    store.getState().tasks
      .map((task: ITaskItem) => task.optimized),
  )
  if (!images.length) return

  fileSave(images, type)
}
