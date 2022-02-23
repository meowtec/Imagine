import { Store } from 'redux'
import { debounce } from 'lodash'
import { TaskStatus, IState } from '../../common/types'
import actions from './actionCreaters'
import { imagineAPI } from '../../bridge/web'

const maxRunningNum = Math.max((navigator.hardwareConcurrency || 2) - 1, 1)

export default class JobRunner {
  private runningNum = 0

  private store?: Store<IState>

  trigger = debounce(() => {
    if (this.runningNum >= maxRunningNum) return
    this.start()
  }, 100)

  watch(store: Store<IState>) {
    this.store = store
    store.subscribe(() => this.trigger())
  }

  private pickPendingTask() {
    const { store } = this
    if (!store) return null
    const state = store.getState()
    return state.tasks.find((task) => task.status === TaskStatus.PENDING)
  }

  private async start() {
    this.runningNum += 1
    const { store } = this
    if (!store) return

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const task = this.pickPendingTask()

      if (!task) break

      try {
        store.dispatch(actions.taskOptimizeStart(task.id))
        const optimized = await imagineAPI.optimize(task)
        store.dispatch(actions.taskOptimizeSuccess(task.id, optimized))
      } catch (err) {
        imagineAPI.logger.error(err)
        store.dispatch(actions.taskOptimizeFail(task.id))
      }
    }

    this.runningNum -= 1
  }
}
