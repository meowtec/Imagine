import { ipcRenderer } from 'electron'
import React from 'react'
import ReactDOM from 'react-dom'
import store from './store/store'
import App from './App'
import { IpcChannel } from '../common/types'
import JobRunner from './store/job-runner'
import subscribe from './store/subscribe'
import listenIpc from './ipc/listen'

const runner = new JobRunner()
runner.watch(store)
subscribe(store)
listenIpc()

ipcRenderer.send(IpcChannel.READY)

ReactDOM.render(
  <App />,
  document.getElementById('app'),
)
