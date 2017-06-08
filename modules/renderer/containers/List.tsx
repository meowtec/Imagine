import store from '../store/store'
import { actions } from '../store/actions'
import { State } from '../store/reducer'
import TaskList, { TaskViewProps, TaskViewDispatchProps } from '../components/TaskList'
import { TaskItem, OptimizeOptions } from '../../common/constants'
import { connect } from 'react-redux'

export default connect<TaskViewProps, TaskViewDispatchProps, {}>((state: State) => ({
  tasks: state.tasks,
}), dispatch => ({
  onRemove (id: string) {
    dispatch(actions.taskDelete([id]))
  },
  onOptionsChange (id: string, options: OptimizeOptions) {
    dispatch(actions.taskUpdateOptions(id, options))
  },
  onClick (id: string) {
    dispatch(actions.taskDetail(id))
  },
}))(TaskList)
