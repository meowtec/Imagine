import * as React from 'react'
import { PureComponent } from 'react'
import * as CSSTransition from 'react-transition-group/CSSTransition'
import * as TransitionGroup from 'react-transition-group/TransitionGroup'
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

export default class TaskList extends PureComponent<ITaskListProps & ITaskListDispatchProps, {}> {
  render() {
    if (this.props.tasks.length) {
      return (
        <TransitionGroup
          className="task-list"
        >
          {this.props.tasks.map(task => (
            <CSSTransition classNames="task" timeout={200} key={task.id}>
              <Item
                onRemove={this.props.onRemove}
                onClick={this.props.onClick}
                onOptionsChange={this.props.onOptionsChange}
                onSave={this.props.onSave}
                task={task}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      )
    }

    return (
      <div className="task-list task-empty">
        <span>{__('drag_files')}</span>
      </div>
    )
  }
}
