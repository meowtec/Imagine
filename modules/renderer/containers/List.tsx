import { connect } from 'react-redux'
import actions from '../store/actionCreaters'
import { IState } from '../store/reducer'
import TaskList, { ITaskListProps, ITaskListDispatchProps } from '../components/TaskList'
import {
  ITaskItem,
  IOptimizeOptions,
  SaveType,
  IpcChannel,
  SupportedExt,
} from '../../common/constants'
import * as apis from '../apis'

export default connect<ITaskListProps, ITaskListDispatchProps, {}, IState>(
  (state) => ({
    tasks: state.tasks,
  }),
  (dispatch) => ({
    onRemove(task: ITaskItem) {
      dispatch(actions.taskDelete([task.id]))
    },
    onOptionsChange(id: string, options: IOptimizeOptions) {
      dispatch(actions.taskUpdateOptions(id, options))
    },
    onExportChange(id: string, ext: SupportedExt) {
      dispatch(actions.taskUpdateExport(id, ext))
    },
    onClick(task: ITaskItem) {
      dispatch(actions.taskDetail(task.id))
    },
    onSave(task: ITaskItem, type: SaveType) {
      task.optimized && apis.fileSave([task.optimized], type)
    },
  }),
)(TaskList)
