import * as React from 'react'
import { PureComponent } from 'react'
import { ITaskItem, IOptimizeOptions } from '../../common/constants'
import Item from './TaskView'
import __ from '../../locales'

import './TaskList.less'

export interface ITaskViewProps {
  tasks: ITaskItem[]
}

export interface ITaskViewDispatchProps {
  onRemove(id: string): void
  onClick(id: string): void
  onOptionsChange(id: string, options: IOptimizeOptions): void
}

export default class TaskList extends PureComponent<ITaskViewProps & ITaskViewDispatchProps, void> {
  render() {
    if (this.props.tasks.length) {
      return (
        <div className="task-list">
          {this.props.tasks.map(task => (
            <Item
              onRemove={this.props.onRemove}
              onClick={this.props.onClick}
              onOptionsChange={this.props.onOptionsChange}
              key={task.id}
              task={task}
            />
          ))}
        </div>
      )
    }

    return (
      <div className="task-list task-empty">
        {__('drag_files')}
      </div>
    )
  }
}
