import { ipcRenderer } from 'electron'
import { Store } from 'redux'
import { IState } from './reducer'
import { shallowCompare } from '../../common/utils'
import { IpcChannel, IBackendState } from '../../common/constants'

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
}
