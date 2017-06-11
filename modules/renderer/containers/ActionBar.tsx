import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { ipcRenderer } from 'electron'
import Icon from '../components/Icon'
import Tooltip from '../components/Tooltip'
import { actions } from '../store/actions'
import store from '../store/store'
import { IpcChannel, SaveType } from '../../common/constants'

import './ActionBar.less'

interface IActionBarProps {
  onRemoveAll(): void
  onSave(type: SaveType): void
  onAdd(): void
}

class ActionBar extends React.PureComponent<IActionBarProps, {}> {
  handleSaveClick(e: React.MouseEvent<HTMLElement>, type: SaveType) {
    e.preventDefault()
    this.props.onSave(type)
  }

  render() {
    return (
      <div className="action-bar">
        <button onClick={this.props.onAdd}>
          <Icon name="add" />
          <span>Add</span>
        </button>

        <button className="tooltip-hover">
          <Icon name="down" />
          <span>Save</span>
          <Tooltip>
            <a href="#" className="tooltip-item" onClick={e => this.handleSaveClick(e, SaveType.OVER)}>
              Save
            </a>
            <a href="#" className="tooltip-item" onClick={e => this.handleSaveClick(e, SaveType.NEW_NAME)}>
              Save with new name
            </a>
            <a href="#" className="tooltip-item" onClick={e => this.handleSaveClick(e, SaveType.NEW_DIR)}>
              Export to
            </a>
          </Tooltip>
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
  onRemoveAll() {
    dispatch(actions.taskClear())
  },

  onAdd() {
    ipcRenderer.send(IpcChannel.FILE_SELECT)
  },

  onSave(type: SaveType) {
    ipcRenderer.send(IpcChannel.SAVE, store.getState().tasks.map(task => task.optimized), type)
  },
}))(ActionBar) as React.ComponentClass<{}>
