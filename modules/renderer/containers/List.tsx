import { connect } from 'react-redux'
import { IState } from '../store/reducer'
import TaskList, { ITaskListProps } from '../components/TaskList'

export default connect<ITaskListProps, {}, {}, IState>(
  (state) => ({
    tasks: state.tasks,
  }),
)(TaskList)
