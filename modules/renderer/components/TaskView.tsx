import * as React from 'react'
import { PureComponent } from 'react'
import * as classnames from 'classnames'
import Select from './Select'
import Icon from './Icon'
import ColorNumber from './ColorNumber'
import { TaskItem, TaskStatus, OptimizeOptions } from '../../common/constants'
import * as _ from '../../common/utils'

import './TaskView.less'

interface TaskViewProps {
  task: TaskItem
  onRemove(id: string): void
  onOptionsChange(id: string, options: OptimizeOptions): void
}

class TaskView extends PureComponent<TaskViewProps, void> {
  handleClear = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    this.props.onRemove(this.props.task.image.id)
  }

  handleColorChange = (color: number) => {
    this.props.onOptionsChange(this.props.task.image.id, {
      ...this.props.task.options,
      color,
    })
  }

  render () {
    const { task } = this.props
    const { image, optimized, options } = task
    const destImage = task.optimized || task.image
    const color = Math.pow(2, Math.round(Math.log2(options.color)))

    const beforeSize = _.size(image.size)
    const afterSize = optimized && _.size(optimized.size)

    const isProcessing = task.status === TaskStatus.PROCESSING

    return (
      <div className={classnames('task-view', '-' + task.status)}>
        <div className="image-view">
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
            <ColorNumber inputReadOnly={true} value={color} onChange={this.handleColorChange} />
          </div>
          <div className="image-sizes">
            {
              optimized
                ? `${afterSize.join('')} / ${beforeSize.join('')} (-${
                  _.percent((image.size - optimized.size) / image.size)
                })`
                : beforeSize.join('')
            }
          </div>
        </div>
      </div>
    )
  }
}

export default TaskView
