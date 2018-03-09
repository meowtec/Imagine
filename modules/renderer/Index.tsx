import { ipcRenderer } from 'electron'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import store from './store/store'
import App from './App'
import { IpcChannel } from '../common/constants'
import Daemon from './store/daemon'
import subscribe from './store/subscribe'
import listenIpc from './ipc/listen'

const daemon = new Daemon()
daemon.watch(store)
subscribe(store)
listenIpc()

ipcRenderer.send(IpcChannel.READY)

ReactDOM.render(
  <App />,
  document.getElementById('app'),
)
