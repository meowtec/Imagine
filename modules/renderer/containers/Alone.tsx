import * as React from 'react'
import { connect } from 'react-redux'
import ImageOptions from '../components/ImageOptions'
import ImageViewer from '../components/ImageViewer'
import Modal from '../components/Modal'
import Icon from '../components/Icon'
import SizeReduce from '../components/SizeReduce'
import { actions } from '../store/actions'
import { State } from '../store/reducer'
import { getTaskById } from '../store/filter'
import { TaskItem, OptimizeOptions, TaskStatus } from '../../common/constants'

import './Alone.less'

type AloneProps = {
  task: TaskItem
}

type AloneDispatchProps = {
  onClose (): void
  onOptionsChange (id: string, options: OptimizeOptions): void
}

class Alone extends React.PureComponent<AloneProps & AloneDispatchProps, any> {
  handleOptionsChange = (options: OptimizeOptions) => {
    this.props.onOptionsChange(this.props.task.id, options)
  }

  render () {
    const { task } = this.props
    const image = task && (task.optimized || task.image)

    return (
      <Modal className="alone-modal" visible={!!task} onClose={this.props.onClose}>
        <ImageViewer src={image && image.url} />
        {
          task ? (
            <div>
              { task.status === TaskStatus.PROCESSING || task.status === TaskStatus.PENDING
                ? <Icon className="-spin" name="color" />
                : null
              }
              <SizeReduce task={task} />
              <div className="paper alone-options">
                <ImageOptions ext={task.image.ext} options={task.options} onChange={this.handleOptionsChange} />
              </div>
            </div>
          ) : null
        }
      </Modal>
    )
  }
}

export default connect<AloneProps, AloneDispatchProps, {}>(state => ({
  task: state.globals.activeId && getTaskById(state.tasks, state.globals.activeId)
}), dispatch => ({
  onClose () {
    dispatch(actions.taskDetail(null))
  },
  onOptionsChange (id: string, options: OptimizeOptions) {
    dispatch(actions.taskUpdateOptions(id, options))
  }
}))(Alone)
