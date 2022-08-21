/**
 * @jest-environment jsdom
 */
import '../_tools/before-test'

import { createStore } from '../../renderer/store/store'
import actions from '../../renderer/store/actionCreaters'
import {
  IImageFile,
  TaskStatus,
  SupportedExt,
} from '../../common/types'

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
        exportExt: SupportedExt.png,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        quality: 80,
        exportExt: SupportedExt.jpg,
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
        exportExt: SupportedExt.png,
      },
      status: TaskStatus.PENDING,
    },
  ])
})

test('task update options', () => {
  const store = createStore()

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskUpdateOptions(image2.id, {
    exportExt: SupportedExt.jpg,
    color: 8,
  }))
  store.dispatch(actions.taskUpdateOptions('notexist', {
    exportExt: SupportedExt.jpg,
    color: 8,
  }))

  expect(store.getState().tasks).toEqual([
    {
      id: image1.id,
      image: image1,
      options: {
        color: 128,
        exportExt: SupportedExt.png,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        color: 8,
        exportExt: SupportedExt.jpg,
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
        exportExt: SupportedExt.png,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        quality: 80,
        exportExt: SupportedExt.jpg,
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
        exportExt: SupportedExt.png,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        quality: 80,
        exportExt: SupportedExt.jpg,
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
        exportExt: SupportedExt.png,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        quality: 80,
        exportExt: SupportedExt.jpg,
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
      exportExt: SupportedExt.png,
    },
  }))

  store.dispatch(actions.defaultOptions({
    ext: SupportedExt.jpg,
    options: {
      quality: 60,
      exportExt: SupportedExt.jpg,
    },
  }))

  expect(store.getState().globals.defaultOptions).toEqual({
    png: {
      color: 8,
      exportExt: SupportedExt.png,
    },

    jpg: {
      quality: 60,
      exportExt: SupportedExt.jpg,
    },

    webp: {
      quality: 80,
      exportExt: SupportedExt.webp,
    },
  })

  store.dispatch(actions.taskAdd([image1, image2]))

  expect(store.getState().tasks).toEqual([
    {
      id: image1.id,
      image: image1,
      options: {
        color: 8,
        exportExt: SupportedExt.png,
      },
      status: TaskStatus.PENDING,
    },
    {
      id: image2.id,
      image: image2,
      options: {
        quality: 60,
        exportExt: SupportedExt.jpg,
      },
      status: TaskStatus.PENDING,
    },
  ])
})
