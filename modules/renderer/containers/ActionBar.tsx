import React, { useCallback } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import Icon from '../components/Icon'
import Popper from '../components/Popper'
import OptionsPanel from './OptionsPanel'
import actions from '../store/actionCreaters'
import { SaveType, IUpdateInfo, IState } from '../../common/types'
import * as apis from '../apis'
import __ from '../../locales'
import pkg from '../../../package.json'
import { isTaskSizeIncreased } from '../../common/task'

import './ActionBar.less'
import { imagineAPI } from '../../bridge/web'

interface IActionBarStateProps {
  count: number
  sizeIncreaseCount: number
  updateInfo: IUpdateInfo | undefined
  optionsVisible: boolean
}

interface IActionBarDispatchProps {
  onRemoveAll(): void
  onRemoveIncreased(): void
  onSave(type: SaveType): void
  onAdd(): void
  onUpdateClick(): void
  onOptionsVisibleToggle(visible: boolean): void
}

function ActionBar({
  count,
  sizeIncreaseCount,
  updateInfo,
  optionsVisible,
  onAdd,
  onSave,
  onRemoveAll,
  onRemoveIncreased,
  onUpdateClick,
  onOptionsVisibleToggle,
}: IActionBarStateProps & IActionBarDispatchProps) {
  const handleOptionsVisibleClick = () => {
    onOptionsVisibleToggle(!optionsVisible)
  }

  const handleOptionsHide = useCallback(() => {
    onOptionsVisibleToggle(false)
  }, [onOptionsVisibleToggle])

  return (
    <div className="action-bar">
      <button type="button" onClick={onAdd}>
        <Icon name="add" />
        <span className="ellipsis">{__('add')}</span>
      </button>

      <Popper
        hoverMode
        popper={(
          <div className="popper-menu">
            <button type="button" onClick={() => onSave(SaveType.OVER)}>
              {__('save_cover')}
            </button>
            <button type="button" onClick={() => onSave(SaveType.NEW_NAME)}>
              {__('save_new')}
            </button>
            <button type="button" onClick={() => onSave(SaveType.NEW_DIR)}>
              {__('save_dir')}
            </button>
          </div>
        )}
      >
        <button type="button" disabled={!count}>
          <div>
            <Icon name="down" />
            <span className="ellipsis">{__('save')}</span>
          </div>
          <Icon name="expand-more" className="expand" />
        </button>
      </Popper>

      <Popper
        hoverMode
        popper={(
          <div className="popper-menu">
            <button type="button" onClick={onRemoveAll}>
              {__('clear')}
            </button>
            <button type="button" onClick={onRemoveIncreased} disabled={!sizeIncreaseCount}>
              {__('clear_increased')}
              {' ('}
              {sizeIncreaseCount}
              )
            </button>
          </div>
        )}
      >
        <button type="button" disabled={!count}>
          <div>
            <Icon name="delete" />
            <span className="ellipsis">{__('clear')}</span>
          </div>
          <Icon name="expand-more" className="expand" />
          {sizeIncreaseCount ? <i className="dot" /> : null}
        </button>
      </Popper>
      {
        updateInfo ? (
          <button type="button" onClick={onUpdateClick} className="has-update">
            <Icon name="up" />
            <span className="ellipsis">{__('new_version')}</span>
          </button>
        ) : null
      }

      <div className="blank" />

      <Popper
        className="options-popper"
        visible={optionsVisible}
        popper={(
          <OptionsPanel onApplyClick={handleOptionsHide} />
        )}
      >
        <button
          type="button"
          className={classnames({
            '-active': optionsVisible,
          })}
          onClick={handleOptionsVisibleClick}
        >
          <Icon name="tune" />
        </button>
      </Popper>
    </div>
  )
}

export default connect<IActionBarStateProps, IActionBarDispatchProps, Record<string, never>, IState>((state) => ({
  count: state.tasks.length,
  updateInfo: state.globals.updateInfo,
  optionsVisible: state.globals.optionsVisible,
  sizeIncreaseCount: state.tasks.reduce(
    (count, item) => (count + (isTaskSizeIncreased(item) ? 1 : 0)),
    0,
  ),
}), (dispatch) => ({
  onRemoveAll() {
    dispatch(actions.taskClear())
  },

  onRemoveIncreased() {
    dispatch(actions.taskClearIncreased())
  },

  onOptionsVisibleToggle(visible: boolean) {
    dispatch(actions.optionsVisible(visible))
  },

  onAdd() {
    apis.fileSelect()
  },

  onSave(type: SaveType) {
    apis.fileSaveAll(type)
  },

  onUpdateClick() {
    imagineAPI.openExternal(`${pkg.homepage}/releases`)
  },
}))(ActionBar)
