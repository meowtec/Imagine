import { connect } from 'react-redux'
import actions from '../store/actionCreaters'
import {
  ITaskItem,
  IOptimizeOptions,
  IState,
  SaveType,
  SupportedExt,
} from '../../common/types'
import * as apis from '../apis'
import TaskView, { ITaskProps, ITaskDispatchProps, ITaskOwnProps } from '../components/TaskView'

export default connect<ITaskProps, ITaskDispatchProps, ITaskOwnProps, IState>(
  (state, ownProps) => ({
    task: state.tasks[ownProps.index],
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
      if (task.optimized) {
        apis.fileSave([task.optimized], type)
      }
    },
  }),
)(TaskView)
