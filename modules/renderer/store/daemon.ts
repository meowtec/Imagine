import { Store } from 'redux'
import optimize from '../apis/optimize'
import { TaskStatus } from '../../common/constants'
import { actions } from './actions'
import { State } from './reducer'
import { debounce } from 'lodash'

export default class Daemon {
  private running = false
  private store: Store<State>

  trigger = debounce(() => {
    if (this.running) return
    this.start()
  }, 100)

  watch (store: Store<State>) {
    this.store = store
    store.subscribe(() => this.trigger())
  }

  private pickPendingTask () {
    const state = this.store.getState()
    return state.tasks.find(task => task.status === TaskStatus.PENDING)
  }

  private async start () {
    this.running = true
    const { store } = this

    while (true) {
      const task = this.pickPendingTask()

      if (!task) break

      try {
        store.dispatch(actions.taskOptimizeStart(task.id))
        const optimized = await optimize(task)
        store.dispatch(actions.taskOptimizeSuccess(task.id, optimized))
      } catch (err) {
        console.error(err)
        store.dispatch(actions.taskOptimizeFail(task.id))
      }
    }

    this.running = false
  }
}
