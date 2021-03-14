import { ipcRenderer } from 'electron'
import actions from '../store/actionCreaters'
import { getActiveTask } from '../store/selectors'
import store from '../store/store'
import {
  IpcChannel, IImageFile, SaveType, ITaskItem, IUpdateInfo,
} from '../../common/constants'
import { showMessage } from '../components/Messager'
import * as apis from '../apis'
import __ from '../../locales'

export default function listenIpc() {
  ipcRenderer.on(IpcChannel.SAVED, () => {
    showMessage({
      message: __('save_success'),
      type: 'success',
    })
  })

  ipcRenderer.on(IpcChannel.SAVE, (e: any, type: SaveType) => {
    const state = store.getState()
    const { activeId } = state.globals
    let task: ITaskItem | undefined
    if (activeId) {
      task = getActiveTask(state)
      if (task && task.optimized) {
        apis.fileSave([task.optimized], type)
        return
      }
    }
    apis.fileSaveAll(type)
  })

  ipcRenderer.on(IpcChannel.FILE_SELECTED, (event: any, data: IImageFile[]) => {
    store.dispatch(actions.taskAdd(data))
  })

  ipcRenderer.on(IpcChannel.APP_UPDATE, (event: any, data: IUpdateInfo) => {
    store.dispatch(actions.appUpdateInfo(data))
  })
}
