jest.mock('../../renderer/apis/')

import * as path from 'path'
import { createStore } from '../../renderer/store/store'
import Daemon from '../../renderer/store/daemon'
import actions, { setStore } from '../../renderer/store/actionCreaters'
import controller from '../../backend/controller'
import { saveFilesTmp } from '../../common/file-utils'
import { sleep } from '../../common/utils'
import { IImageFile, IOptimizeOptions, ITaskItem, TaskStatus } from '../../common/constants'

test('optimize daemon', async () => {
  const images = await saveFilesTmp(
    ['600_600.png', 'qr.png'].map(x => path.resolve(__dirname, '../_files', x))
  )
  const store = createStore()
  new Daemon().watch(store)
  let state

  store.dispatch(actions.taskAdd(images as IImageFile[]))

  // for debounce
  await sleep(100)

  state = store.getState()

  expect(state.tasks[0].status).toBe(TaskStatus.PROCESSING)
  expect(state.tasks[1].status).toBe(TaskStatus.PENDING)

  // enough for processing two PNG
  await sleep(500)

  state = store.getState()
  expect(state.tasks[0].status).toBe(TaskStatus.DONE)
  expect(state.tasks[1].status).toBe(TaskStatus.DONE)
  // expect(state.tasks[0].optimized.color).toBe(64)
  // expect(state.tasks[1].optimized.color).toBe(64)

  await sleep(10)

  // update options and auto optimized
  store.dispatch(actions.taskUpdateOptions((images[0] as IImageFile).id, {
    color: 8,
  }))

  // for debounce
  await sleep(100)

  state = store.getState()
  expect(state.tasks[0].status).toBe(TaskStatus.PROCESSING)
  expect(state.tasks[1].status).toBe(TaskStatus.DONE)

  await sleep(200)

  state = store.getState()
  expect(state.tasks[0].status).toBe(TaskStatus.DONE)
  // expect(state.tasks[0].optimized.color).toBe(8)
})
