import * as React from 'react'
import { PureComponent } from 'react'
import * as classnames from 'classnames'
import Tooltip from '../components/Tooltip'
import Select from './Select'
import Icon from './Icon'
import ImageOptions from './ImageOptions'
import SizeReduce from './SizeReduce'
import { ITaskItem, TaskStatus, IOptimizeOptions, SaveType } from '../../common/constants'
import * as _ from '../../common/utils'
import __ from '../../locales'

import './TaskView.less'

interface ITaskViewProps {
  task: ITaskItem
  onRemove(task: ITaskItem): void
  onClick(task: ITaskItem): void
  onSave(task: ITaskItem, type: SaveType): void
  onOptionsChange(task: ITaskItem, options: IOptimizeOptions): void
}

class TaskView extends PureComponent<ITaskViewProps, {}> {
  handleClear = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation()

    this.props.onRemove(this.props.task)
  }

  handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onClick(this.props.task)
  }

  handleOptionsChange = (options: IOptimizeOptions) => {
    this.props.onOptionsChange(this.props.task, options)
  }

  handleSave = (e: React.MouseEvent<any>, type: SaveType) => {
    e.preventDefault()
    e.stopPropagation()

    this.props.onSave(this.props.task, type)
  }

  render() {
    const { task, onOptionsChange } = this.props
    const { image, optimized, options } = task
    const destImage = task.optimized || task.image
    const isProcessing = task.status === TaskStatus.PROCESSING

    return (
      <div className={classnames('task-view', '-' + task.status)}>
        <div className="image-view" onClick={this.handleClick}>
          <img src={destImage.url} alt="task-cover"/>
          <div className="image-view-menu">
            <span className="traffic">
              <Icon
                name={isProcessing ? 'color' : 'dot'}
                className={classnames({
                  '-spin': isProcessing,
                })}
              />
            </span>
            <span className="save-btn tooltip-hover">
              <Icon name="down" />
              <Tooltip>
                <a
                  className="tooltip-item"
                  href="#"
                  onClick={e => this.handleSave(e, SaveType.OVER)}
                >
                  {__('save')}
                </a>
                <a
                  className="tooltip-item"
                  href="#"
                  onClick={e => this.handleSave(e, SaveType.SAVE_AS)}
                >
                  {__('save_as')}
                </a>
              </Tooltip>
            </span>
            <span className="__center" />
            <a className="close" onClick={this.handleClear} href="#">
              <Icon name="clear" />
            </a>
          </div>
        </div>
        <div className="image-profile">
          <ImageOptions
            ext={image.ext}
            options={options}
            precision={false}
            onChange={this.handleOptionsChange}
          />
          <div className="image-sizes">
            <SizeReduce task={task} />
          </div>
        </div>
      </div>
    )
  }
}

export default TaskView
