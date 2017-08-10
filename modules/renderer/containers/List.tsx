import { connect } from 'react-redux'
import store from '../store/store'
import actions from '../store/actionCreaters'
import { IState } from '../store/reducer'
import TaskList, { ITaskListProps, ITaskListDispatchProps } from '../components/TaskList'
import { ITaskItem, IOptimizeOptions, SaveType, IpcChannel } from '../../common/constants'
import * as apis from '../apis'

export default connect<ITaskListProps, ITaskListDispatchProps, {}>((state: IState) => ({
  tasks: state.tasks,
}), dispatch => ({
  onRemove(task: ITaskItem) {
    dispatch(actions.taskDelete([task.id]))
  },
  onOptionsChange(task: ITaskItem, options: IOptimizeOptions) {
    dispatch(actions.taskUpdateOptions(task.id, options))
  },
  onClick(task: ITaskItem) {
    dispatch(actions.taskDetail(task.id))
  },
  onSave(task: ITaskItem, type: SaveType) {
    task.optimized && apis.fileSave([task.optimized], type)
  },
}))(TaskList)
