import { ipcRenderer } from 'electron'
import store from '../store/store'
import { actions } from '../store/actions'
import { IState } from '../store/reducer'
import TaskList, { ITaskListProps, ITaskListDispatchProps } from '../components/TaskList'
import { ITaskItem, IOptimizeOptions, SaveType, IpcChannel } from '../../common/constants'
import { connect } from 'react-redux'

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
    ipcRenderer.send(IpcChannel.SAVE, [task.image], type)
  },
}))(TaskList)
