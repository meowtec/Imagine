import * as path from 'path'
import { createStore } from '../../renderer/store/store'
import actions, { setStore } from '../../renderer/store/actionCreaters'
import controller from '../../backend/controller'
import {
  IImageFile,
  IOptimizeOptions,
  ITaskItem,
  TaskStatus,
  SupportedExt,
} from '../../common/constants'

const image1: IImageFile = {
  id: '01',
  url: '01.png',
  size: 100,
  ext: SupportedExt.png,
  originalName: 'file.png',
}

const image2: IImageFile = {
  id: '02',
  url: '02.jpg',
  size: 101,
  ext: SupportedExt.jpg,
  originalName: 'file.jpg',
}

test('initial state', () => {
  const store = createStore()

  expect(store.getState().tasks).toEqual([])
})

test('task add', () => {
  const store = createStore()

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskAdd([image1, image2]))

  expect(store.getState().tasks).toEqual([
    {
      id: image1.id,
      image: image1,
      options: {
        color: 128,
        quality: 70,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        color: 128,
        quality: 70,
      },
      status: TaskStatus.PENDING,
    },
  ])
})

test('task delete', () => {
  const store = createStore()

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskDelete([image2.id, 'notexist']))

  expect(store.getState().tasks).toEqual([
    {
      id: image1.id,
      image: image1,
      options: {
        color: 128,
        quality: 70,
      },
      status: TaskStatus.PENDING,
    },
  ])
})

test('task update options', () => {
  const store = createStore()

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskUpdateOptions(image2.id, {
    color: 8,
  }))
  store.dispatch(actions.taskUpdateOptions('notexist', {
    color: 8,
  }))

  expect(store.getState().tasks).toEqual([
    {
      id: image1.id,
      image: image1,
      options: {
        color: 128,
        quality: 70,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        color: 8,
      },
      status: TaskStatus.PENDING,
    },
  ])
})

test('task start', () => {
  const store = createStore()

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskOptimizeStart(image2.id))
  store.dispatch(actions.taskOptimizeStart('notexist'))

  expect(store.getState().tasks).toEqual([
    {
      id: image1.id,
      image: image1,
      options: {
        color: 128,
        quality: 70,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        color: 128,
        quality: 70,
      },
      status: TaskStatus.PROCESSING,
    },
  ])
})

test('task success', () => {
  const store = createStore()

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskOptimizeSuccess(image2.id, {
    id: '03',
    url: '02.jpg',
    size: 101,
    ext: SupportedExt.jpg,
    originalName: 'file-result.jpg',
  }))
  store.dispatch(actions.taskOptimizeSuccess('notexist', {} as IImageFile))

  expect(store.getState().tasks).toEqual([
    {
      id: image1.id,
      image: image1,
      options: {
        color: 128,
        quality: 70,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        color: 128,
        quality: 70,
      },
      status: TaskStatus.DONE,
      optimized: {
        id: '03',
        url: '02.jpg',
        size: 101,
        ext: 'jpg',
        originalName: 'file-result.jpg',
      },
    },
  ])
})

test('task fail', () => {
  const store = createStore()

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskOptimizeFail(image2.id))
  store.dispatch(actions.taskOptimizeFail('notexist'))

  expect(store.getState().tasks).toEqual([
    {
      id: image1.id,
      image: image1,
      options: {
        color: 128,
        quality: 70,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        color: 128,
        quality: 70,
      },
      status: TaskStatus.FAIL,
    },
  ])
})

test('globals', () => {
  const store = createStore()

  store.dispatch(actions.taskDetail('detailId'))

  expect(store.getState().globals.activeId).toBe('detailId')

  store.dispatch(actions.taskDetail(null))

  expect(store.getState().globals.activeId).toBe(null)
})

test('set globalOptions', () => {
  const store = createStore()

  store.dispatch(actions.defaultOptions({
    ext: SupportedExt.png,
    options: {
      color: 8,
    },
  }))

  store.dispatch(actions.defaultOptions({
    ext: SupportedExt.jpg,
    options: {
      quality: 60,
    },
  }))

  expect(store.getState().globals.defaultOptions).toEqual({
    png: {
      color: 8,
    },

    jpg: {
      quality: 60,
    },
  })

  store.dispatch(actions.taskAdd([image1, image2]))

  expect(store.getState().tasks).toEqual([
    {
      id: image1.id,
      image: image1,
      options: {
        color: 8,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        quality: 60,
      },
      status: TaskStatus.PENDING,
    },
  ])
})
