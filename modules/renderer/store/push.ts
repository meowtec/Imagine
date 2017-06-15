import { ipcRenderer } from 'electron'
import { Store } from 'redux'
import { IState } from './reducer'
import { actions } from './actions'
import { IImageFile, IpcChannel } from '../../common/constants'

const listenPush = (store: Store<IState>) => {
  ipcRenderer.on(IpcChannel.FILE_SELECTED, (event: any, data: IImageFile[]) => {
    const emptyTask = store.getState().tasks.length === 0
    store.dispatch(actions.taskAdd(data))
    if (emptyTask && data.length === 1) {
      store.dispatch(actions.taskDetail(data[0].id))
    }
  })
}

export default listenPush
