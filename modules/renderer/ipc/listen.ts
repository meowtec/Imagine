import { ipcRenderer } from 'electron'
import { Store } from 'redux'
import actions from '../store/actionCreaters'
import { getTaskById } from '../store/filter'
import store from '../store/store'
import { shallowCompare } from '../../common/utils'
import { IpcChannel, IImageFile, SaveType, ITaskItem, IUpdateInfo } from '../../common/constants'
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
      task = getTaskById(state.tasks, activeId)
      if (task && task.optimized) {
        apis.fileSave([task.optimized], type)
        return
      }
    }
    apis.fileSaveAll(type)
  })

  ipcRenderer.on(IpcChannel.FILE_SELECTED, (event: any, data: IImageFile[]) => {
    const emptyTask = store.getState().tasks.length === 0
    store.dispatch(actions.taskAdd(data))
    if (emptyTask && data.length === 1) {
      store.dispatch(actions.taskDetail(data[0].id))
    }
  })

  ipcRenderer.on(IpcChannel.APP_UPDATE, (event: any, data: IUpdateInfo) => {
    store.dispatch(actions.appUpdateInfo(data))
  })
}
