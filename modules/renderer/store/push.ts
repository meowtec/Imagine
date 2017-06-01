import { ipcRenderer } from 'electron'
import { Store } from 'redux'
import { State } from './reducer'
import { actions } from './actions'
import { ImageFile, IpcChannel } from '../../common/constants'

const listenPush = (store: Store<State>) => {
  ipcRenderer.on(IpcChannel.FILE_SELECTED, (event, data: ImageFile[]) => {
    store.dispatch(actions.taskAdd(data))
  })
}

export default listenPush
