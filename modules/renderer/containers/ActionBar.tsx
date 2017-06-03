import * as React from 'react'
import Icon from '../components/Icon'
import { connect, Dispatch } from 'react-redux'
import { actions } from '../store/actions'
import { ipcRenderer } from 'electron'
import { IpcChannel } from '../../common/constants'

import './ActionBar.less'

interface ActionBarProps {
  onRemoveAll(): void
}

class ActionBar extends React.PureComponent<ActionBarProps, {}> {
  handleAdd = () => {
    ipcRenderer.send(IpcChannel.FILE_SELECT)
  }

  render () {
    return (
      <div className="action-bar">
        <button onClick={this.handleAdd}>
          <Icon name="add" />
          <span>Add</span>
        </button>

        <button>
          <Icon name="down" />
          <span>Save</span>
        </button>

        <button onClick={this.props.onRemoveAll}>
          <Icon name="delete" />
          <span>Clear</span>
        </button>

      </div>
    )
  }
}

export default connect(null, dispatch => ({
  onRemoveAll () {
    dispatch(actions.taskClear())
  }
}))(ActionBar)
