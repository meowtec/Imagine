import { ipcRenderer } from 'electron'
import { Store } from 'redux'
import { IState } from './reducer'
import { actions } from './actions'
import { getTaskById } from './filter'
import { shallowCompare } from '../../common/utils'
import { IpcChannel, IImageFile, SaveType, IBackendState, ITaskItem, IUpdateInfo } from '../../common/constants'
import { showMessage } from '../components/Messager'
import * as apis from '../apis'
import __ from '../../locales'

export default function(store: Store<IState>) {
  let backendState: IBackendState

  store.subscribe(() => {
    const state = store.getState()
    const nextBackendState: IBackendState = {
      taskCount: state.tasks.length,
      aloneMode: !!state.globals.activeId,
    }

    if (!shallowCompare(backendState, nextBackendState)) {
      ipcRenderer.send(IpcChannel.SYNC, nextBackendState)
    }

    backendState = nextBackendState
  })

  ipcRenderer.on(IpcChannel.SAVED, () => {
    showMessage({
      message: __('save_success'),
      type: 'success',
    })
  })

  ipcRenderer.on(IpcChannel.SAVE, (e: any, type: SaveType) => {
    const state = store.getState()
    const { activeId } = state.globals
    let task: ITaskItem
    if (activeId) {
      task = getTaskById(state.tasks, activeId)
      if (task) {
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
