import { connect } from 'react-redux'
import { IState } from '../../common/types'
import TaskList, { ITaskListProps } from '../components/TaskList'

export default connect<ITaskListProps, Record<string, never>, Record<string, never>, IState>(
  (state) => ({
    tasks: state.tasks,
  }),
)(TaskList)
