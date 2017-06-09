import { ipcRenderer } from 'electron'
import { Store } from 'redux'
import { IState } from './reducer'
import { actions } from './actions'
import { IImageFile, IpcChannel } from '../../common/constants'

const listenPush = (store: Store<IState>) => {
  ipcRenderer.on(IpcChannel.FILE_SELECTED, (event, data: IImageFile[]) => {
    store.dispatch(actions.taskAdd(data))
  })
}

export default listenPush
