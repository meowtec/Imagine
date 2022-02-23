import actions from '../store/actionCreaters'
import { getActiveTask } from '../store/selectors'
import store from '../store/store'
import {
  IpcChannel, IImageFile, SaveType, ITaskItem, IUpdateInfo,
} from '../../common/types'
import { showMessage } from '../components/Messager'
import * as apis from '../apis'
import __ from '../../locales'
import { imagineAPI } from '../../bridge/web'

export default function listenIpc() {
  if (!imagineAPI) {
    // eslint-disable-next-line no-console
    console.warn('window.imagineAPI is missing')
    return
  }

  imagineAPI.ipcListen(IpcChannel.SAVED, () => {
    showMessage({
      message: __('save_success'),
      type: 'success',
    })
  })

  imagineAPI.ipcListen(IpcChannel.SAVE, (type: SaveType) => {
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

  imagineAPI.ipcListen(IpcChannel.FILE_SELECTED, (data: IImageFile[]) => {
    store.dispatch(actions.taskAdd(data))
  })

  imagineAPI.ipcListen(IpcChannel.APP_UPDATE, (data: IUpdateInfo) => {
    store.dispatch(actions.appUpdateInfo(data))
  })
}
