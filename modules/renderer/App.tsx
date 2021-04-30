import React, { PureComponent, DragEvent } from 'react'
import classnames from 'classnames'
import { Provider } from 'react-redux'
import List from './containers/List'
import ActionBar from './containers/ActionBar'
import Alone from './containers/Alone'
import { prevent } from './utils/dom-event'
import store from './store/store'
import * as apis from './apis'

import './components/Icon'
import './App.less'

class App extends PureComponent<Record<string, never>, { onion: number }> {
  constructor(props: Record<string, never>) {
    super(props)

    this.state = {
      onion: 0,
    }
  }

  handleDragEnter = () => {
    this.setState((state) => ({
      onion: state.onion + 1,
    }))
  }

  handleDragLeave = () => {
    this.setState((state) => ({
      onion: state.onion - 1,
    }))
  }

  handleDragDrop = (e: DragEvent<HTMLDivElement>) => {
    this.setState({
      onion: 0,
    })

    const files = Array.from(e.dataTransfer.files)
      .filter((file) => !file.type || /png|jpeg/.test(file.type))
      .map((file) => file.path)

    apis.fileAdd(files)
  }

  render() {
    const { onion } = this.state

    return (
      <Provider store={store}>
        <div
          className={classnames('layout', {
            '-drag': !!onion,
          })}
          onDragOver={prevent}
          onDragEnter={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          onDrop={this.handleDragDrop}
        >
          <ActionBar />
          <List />
        </div>
        <Alone />
      </Provider>
    )
  }
}

export default App
