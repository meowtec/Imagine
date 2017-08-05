import { shell } from 'electron'
import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import Icon from '../components/Icon'
import Popper from '../components/Popper'
import { actions } from '../store/actions'
import { IState } from '../store/reducer'
import store from '../store/store'
import { IpcChannel, SaveType, IUpdateInfo } from '../../common/constants'
import * as apis from '../apis'
import __ from '../../locales'
import * as pkg from '../../../package.json'

import './ActionBar.less'

interface IActionBarProps {
  count: number
  updateInfo: IUpdateInfo
  onRemoveAll(): void
  onSave(type: SaveType): void
  onAdd(): void
  onUpdateClick(): void
}

class ActionBar extends React.PureComponent<IActionBarProps, {}> {
  handleSaveClick(e: React.MouseEvent<HTMLElement>, type: SaveType) {
    e.preventDefault()
    this.props.onSave(type)
  }

  render() {
    const { count, updateInfo } = this.props

    return (
      <div className="action-bar">
        <button onClick={this.props.onAdd}>
          <Icon name="add" />
          <span className="ellipsis">{__('add')}</span>
        </button>

        <Popper popper={(
          <div className="popper-menu">
            <a href="#" onClick={e => this.handleSaveClick(e, SaveType.OVER)}>
              {__('save_cover')}
            </a>
            <a href="#" onClick={e => this.handleSaveClick(e, SaveType.NEW_NAME)}>
              {__('save_new')}
            </a>
            <a href="#" onClick={e => this.handleSaveClick(e, SaveType.NEW_DIR)}>
              {__('save_dir')}
            </a>
          </div>
          )}>
          <button className="tooltip-hover" disabled={!count}>
            <Icon name="down" />
            <span className="ellipsis">{__('save')}</span>
          </button>
        </Popper>

        <button onClick={this.props.onRemoveAll} disabled={!count}>
          <Icon name="delete" />
          <span className="ellipsis">{__('clear')}</span>
        </button>

        {
          updateInfo ? (
            <button onClick={this.props.onUpdateClick} className="has-update">
              <Icon name="up"/>
              <span className="ellipsis">{__('new_version')}</span>
            </button>
          ) : null
        }
      </div>
    )
  }
}

export default connect((state: IState) => ({
  count: state.tasks.length,
  updateInfo: state.globals.updateInfo,
}), dispatch => ({
  onRemoveAll() {
    dispatch(actions.taskClear())
  },

  onAdd() {
    apis.fileSelect()
  },

  onSave(type: SaveType) {
    apis.fileSaveAll(type)
  },

  onUpdateClick() {
    shell.openExternal(pkg.homepage + '/releases')
  },
}))(ActionBar) as React.ComponentClass<{}>
