import store from '../store/store'
import { ipcRenderer } from 'electron'
import { IpcChannel, IImageFile, SaveType } from '../../common/constants'

export const fileAdd = (files: string[]) => ipcRenderer.send(IpcChannel.FILE_ADD, files)

export const fileSelect = () => ipcRenderer.send(IpcChannel.FILE_SELECT)

export const fileSave = (images: IImageFile[], type: SaveType) => ipcRenderer.send(IpcChannel.SAVE, images, type)

export const fileSaveAll = (type: SaveType) => {
  const images = store
    .getState()
    .tasks
    .map(task => task.optimized)
    .filter(_ => _) as IImageFile[]
  if (!images.length) return
  fileSave(images, type)
}
