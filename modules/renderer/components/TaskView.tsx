import React, { PureComponent, MouseEvent } from 'react'
import classnames from 'classnames'
import Popper from './Popper'
import Icon from './Icon'
import ImageOptions from './ImageOptions'
import SizeReduce from './SizeReduce'
import TargetTypeSelect from './TargetTypeSelect'
import {
  ITaskItem,
  TaskStatus,
  IOptimizeOptions,
  SaveType,
  SupportedExt,
  Empty,
} from '../../common/types'
import __ from '../../locales'

import './TaskView.less'

export interface ITaskProps {
  task: ITaskItem
}

export interface ITaskOwnProps {
  index: number
}

export interface ITaskDispatchProps {
  onRemove(task: ITaskItem): void
  onClick(task: ITaskItem): void
  onSave(task: ITaskItem, type: SaveType): void
  onOptionsChange(id: string, options: IOptimizeOptions): void
  onExportChange(id: string, ext: SupportedExt): void
}

class TaskView extends PureComponent<ITaskProps & ITaskDispatchProps, Empty> {
  handleClear = (e: MouseEvent<HTMLElement>) => {
    this.stopEvent(e)

    const { task, onRemove } = this.props
    onRemove(task)
  }

  handleClick = () => {
    const { task, onClick } = this.props

    if (task.status === 'FAIL') return

    onClick(task)
  }

  handleOptionsChange = (options: IOptimizeOptions) => {
    const { task, onOptionsChange } = this.props

    onOptionsChange(task.id, options)
  }

  handleExtChange = (ext: SupportedExt) => {
    const { task, onExportChange } = this.props
    onExportChange(task.id, ext)
  }

  handleSave = (e: MouseEvent<Element>, type: SaveType) => {
    this.stopEvent(e)

    const { task, onSave } = this.props
    onSave(task, type)
  }

  handleRefreah = (e: MouseEvent<Element>) => {
    this.stopEvent(e)

    const { task, onOptionsChange } = this.props
    onOptionsChange(task.id, task.options)
  }

  stopEvent = (e: MouseEvent<Element>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  render() {
    const { task } = this.props
    const { image, options } = task
    const destImage = task.optimized || task.image
    const isProcessing = task.status === TaskStatus.PROCESSING
    const exportExt = options.exportExt || image.ext

    return (
      <div className={classnames('task-view', `-${task.status}`)}>
        <div className="image-view" onClick={this.handleClick}>
          <img
            src={destImage.url}
            loading="lazy"
            alt="task-cover"
          />
          <div className="image-view-menu">
            <Popper
              hoverMode
              popper={<div className="popper-body">{task.status}</div>}
            >
              <span className="traffic">
                <Icon
                  name={isProcessing ? 'color' : 'dot'}
                  className={classnames({
                    '-spin': isProcessing,
                  })}
                />
              </span>
            </Popper>

            {
              task.status === TaskStatus.FAIL ? (
                <button type="button" onClick={this.handleRefreah}>
                  <Icon name="refresh" />
                </button>
              ) : null
            }

            <Popper
              hoverMode
              popper={(
                <div className="popper-menu">
                  <button
                    type="button"
                    onClick={(e) => this.handleSave(e, SaveType.OVER)}
                  >
                    {__('save')}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => this.handleSave(e, SaveType.SAVE_AS)}
                  >
                    {__('save_as')}
                  </button>
                </div>
              )}
            >
              <button type="button" onClick={this.stopEvent}>
                <Icon name="down" />
              </button>
            </Popper>

            <span className="blank" />

            <button type="button" className="close" onClick={this.handleClear}>
              <Icon name="clear" />
            </button>
          </div>
        </div>
        <div className="image-profile">
          <ImageOptions
            ext={exportExt}
            options={options}
            precision={false}
            onChange={this.handleOptionsChange}
          />
          <div>
            <div className="image-sizes">
              <TargetTypeSelect
                sourceExt={image.ext}
                targetExt={exportExt}
                onChange={this.handleExtChange}
              />
              <SizeReduce task={task} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default TaskView
