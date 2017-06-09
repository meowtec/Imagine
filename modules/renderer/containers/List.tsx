import store from '../store/store'
import { actions } from '../store/actions'
import { IState } from '../store/reducer'
import TaskList, { ITaskViewProps, ITaskViewDispatchProps } from '../components/TaskList'
import { ITaskItem, IOptimizeOptions } from '../../common/constants'
import { connect } from 'react-redux'

export default connect<ITaskViewProps, ITaskViewDispatchProps, {}>((state: IState) => ({
  tasks: state.tasks,
}), dispatch => ({
  onRemove(id: string) {
    dispatch(actions.taskDelete([id]))
  },
  onOptionsChange(id: string, options: IOptimizeOptions) {
    dispatch(actions.taskUpdateOptions(id, options))
  },
  onClick(id: string) {
    dispatch(actions.taskDetail(id))
  },
}))(TaskList)
