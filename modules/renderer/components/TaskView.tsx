import * as React from 'react'
import { PureComponent } from 'react'
import * as classnames from 'classnames'
import Select from './Select'
import Icon from './Icon'
import ImageOptions from './ImageOptions'
import SizeReduce from './SizeReduce'
import { TaskItem, TaskStatus, OptimizeOptions } from '../../common/constants'
import * as _ from '../../common/utils'

import './TaskView.less'

interface TaskViewProps {
  task: TaskItem
  onRemove(id: string): void
  onClick(id: string): void
  onOptionsChange(id: string, options: OptimizeOptions): void
}

class TaskView extends PureComponent<TaskViewProps, void> {
  handleClear = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    e.stopPropagation()

    this.props.onRemove(this.props.task.id)
  }

  handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onClick(this.props.task.id)
  }

  handleOptionsChange = (options: OptimizeOptions) => {
    this.props.onOptionsChange(this.props.task.id, options)
  }

  render () {
    const { task, onOptionsChange } = this.props
    const { image, optimized, options } = task
    const destImage = task.optimized || task.image
    const color = Math.pow(2, Math.round(Math.log2(options.color)))

    const isProcessing = task.status === TaskStatus.PROCESSING

    return (
      <div className={classnames('task-view', '-' + task.status)}>
        <div className="image-view" onClick={this.handleClick}>
          <img src={destImage.url} alt="task-cover"/>
          <span className="traffic-light">
            <Icon
              name={isProcessing ? 'color' : 'dot'}
              className={classnames({
                '-spin': isProcessing,
              })}
            />
          </span>
          <a onClick={this.handleClear} href="#" className="close">
            <Icon name="clear" />
          </a>
        </div>
        <div className="image-profile">
          <div className="image-options">
            <ImageOptions ext={image.ext} options={options} onChange={this.handleOptionsChange} />
          </div>
          <div className="image-sizes">
            <SizeReduce task={task} />
          </div>
        </div>
      </div>
    )
  }
}

export default TaskView
