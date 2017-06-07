import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as classnanes from 'classnames'
import { Provider } from 'react-redux'
import { State } from './store/reducer'
import Modal from './components/Modal'
import List from './containers/List'
import ActionBar from './containers/ActionBar'
import Alone from './containers/Alone'
import { prevent } from './utils/dom-event'
import { IpcChannel } from '../common/constants'
import { ipcRenderer } from 'electron'
import store from './store/store'

import './components/Icon'
import './App.less'

export default class App extends React.PureComponent<{}, {}> {
  state = {
    onion: 0,
  }

  handleDragEnter = () => {
    this.setState({
      onion: this.state.onion + 1,
    })
  }

  handleDragLeave = () => {
    this.setState({
      onion: this.state.onion - 1,
    })
  }

  handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    this.setState({
      onion: 0,
    })

    const files = Array.from(e.dataTransfer.files)
      .filter(file => {
        return /png|jpeg/.test(file.type)
      })
      .map(file => file.path)

    ipcRenderer.send(IpcChannel.FILE_ADD, files)
  }

  render () {
    return (
      <Provider store={store}>
        <div
          className={classnanes('layout', {
            '-drag': !!this.state.onion,
          })}
          onDragOver={prevent}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDrop={this.handleDragDrop}
        >
          <ActionBar />
          <List />
          <Alone />
        </div>
      </Provider>
    )
  }
}
