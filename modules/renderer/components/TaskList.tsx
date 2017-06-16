import * as React from 'react'
import { PureComponent } from 'react'
import { ITaskItem, IOptimizeOptions, SaveType } from '../../common/constants'
import Item from './TaskView'
import __ from '../../locales'

import './TaskList.less'

export interface ITaskListProps {
  tasks: ITaskItem[]
}

export interface ITaskListDispatchProps {
  onRemove(task: ITaskItem): void
  onClick(task: ITaskItem): void
  onSave(task: ITaskItem, type: SaveType): void
  onOptionsChange(task: ITaskItem, options: IOptimizeOptions): void
}

export default class TaskList extends PureComponent<ITaskListProps & ITaskListDispatchProps, void> {
  render() {
    if (this.props.tasks.length) {
      return (
        <div className="task-list">
          {this.props.tasks.map(task => (
            <Item
              onRemove={this.props.onRemove}
              onClick={this.props.onClick}
              onOptionsChange={this.props.onOptionsChange}
              onSave={this.props.onSave}
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
