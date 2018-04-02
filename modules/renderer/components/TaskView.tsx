import React, { PureComponent, MouseEvent } from 'react'
import classnames from 'classnames'
import Popper from '../components/Popper'
import Select from './Select'
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
} from '../../common/constants'
import * as _ from '../../common/utils'
import __ from '../../locales'

import './TaskView.less'

interface ITaskViewProps {
  task: ITaskItem
  onRemove(task: ITaskItem): void
  onClick(task: ITaskItem): void
  onSave(task: ITaskItem, type: SaveType): void
  onOptionsChange(id: string, options: IOptimizeOptions): void
  onExportChange(id: string, ext: SupportedExt): void
}

class TaskView extends PureComponent<ITaskViewProps, {}> {
  handleClear = (e: MouseEvent<HTMLAnchorElement>) => {
    this.stopEvent(e)

    this.props.onRemove(this.props.task)
  }

  handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (this.props.task.status === 'FAIL') return

    this.props.onClick(this.props.task)
  }

  handleOptionsChange = (options: IOptimizeOptions) => {
    this.props.onOptionsChange(this.props.task.id, options)
  }

  handleExtChange = (ext: SupportedExt) => {
    const { task } = this.props
    this.props.onExportChange(task.id, ext)
  }

  handleSave = (e: MouseEvent<Element>, type: SaveType) => {
    this.stopEvent(e)

    this.props.onSave(this.props.task, type)
  }

  handleRefreah = (e: MouseEvent<Element>) => {
    this.stopEvent(e)

    const { task } = this.props
    this.props.onOptionsChange(task.id, task.options)
  }

  stopEvent = (e: MouseEvent<Element>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  render() {
    const { task, onOptionsChange } = this.props
    const { image, optimized, options } = task
    const destImage = task.optimized || task.image
    const isProcessing = task.status === TaskStatus.PROCESSING
    const exportExt = options.exportExt || image.ext

    return (
      <div className={classnames('task-view', '-' + task.status)}>
        <div className="image-view" onClick={this.handleClick}>
          <img src={destImage.url} alt="task-cover"/>
          <div className="image-view-menu">
            <Popper
              hoverMode={true}
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
                <a href="#" onClick={this.handleRefreah}>
                  <Icon name="refresh" />
                </a>
              ) : null
            }

            <Popper
              hoverMode={true}
              popper={(
                <div className="popper-menu">
                  <a
                    href="#"
                    onClick={e => this.handleSave(e, SaveType.OVER)}
                  >
                    {__('save')}
                  </a>
                  <a
                    href="#"
                    onClick={e => this.handleSave(e, SaveType.SAVE_AS)}
                  >
                    {__('save_as')}
                  </a>
                </div>
              )}>
              <a href="#" onClick={this.stopEvent}>
                <Icon name="down" />
              </a>
            </Popper>

            <span className="blank" />

            <a className="close" href="#" onClick={this.handleClear}>
              <Icon name="clear" />
            </a>
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
