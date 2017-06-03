import * as path from 'path'
import { createStore } from 'redux'
import reducer from '../../renderer/store/reducer'
import { actions } from '../../renderer/store/actions'
import controller from '../../backend/controller'
import { ImageFile, OptimizeOptions, TaskItem, TaskStatus } from '../../common/constants'

const image1 = {
  id: '01',
  url: '01.png',
  size: 100,
  ext: 'png',
  color: 64,
  originalName: 'file.png',
}
const image2 = {
  id: '02',
  url: '02.png',
  size: 101,
  ext: 'png',
  color: 64,
  originalName: 'file.png',
}

test('initial state', () => {
  const store = createStore(reducer)
  expect(store.getState().tasks).toEqual([])
})

test('task add', () => {
  const store = createStore(reducer)

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskAdd([image1, image2]))

  expect(store.getState().tasks).toEqual([
    {
      image: image1,
      options: {
        color: 64,
      },
      status: TaskStatus.PENDING,
    },
    {
      image: image2,
      options: {
        color: 64,
      },
      status: TaskStatus.PENDING,
    }
  ])
})

test('task delete', () => {
  const store = createStore(reducer)

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskDelete([image2.id, 'notexist']))

  expect(store.getState().tasks).toEqual([
    {
      image: image1,
      options: {
        color: 64,
      },
      status: TaskStatus.PENDING,
    }
  ])
})

test('task update options', () => {
  const store = createStore(reducer)

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskUpdateOptions(image2.id, {
    color: 8,
  }))
  store.dispatch(actions.taskUpdateOptions('notexist', {
    color: 8,
  }))

  expect(store.getState().tasks).toEqual([
      {
        image: image1,
        options: {
          color: 64,
        },
        status: TaskStatus.PENDING,
      },
      {
        image: image2,
        options: {
          color: 8,
        },
        status: TaskStatus.PENDING,
      }
    ])
})

test('task start', () => {
  const store = createStore(reducer)

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskOptimizeStart(image2.id))
  store.dispatch(actions.taskOptimizeStart('notexist'))

  expect(store.getState().tasks).toEqual([
    {
      image: image1,
      options: {
        color: 64,
      },
      status: TaskStatus.PENDING,
    },
    {
      image: image2,
      options: {
        color: 64,
      },
      status: TaskStatus.PROCESSING,
    }
  ])
})

test('task success', () => {
  const store = createStore(reducer)

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskOptimizeSuccess(image2.id, {
    id: '03',
    url: '02.png',
    size: 101,
    ext: 'png',
    color: 8,
    originalName: 'file-result.png',
  }))
  store.dispatch(actions.taskOptimizeSuccess('notexist', {} as ImageFile))

  expect(store.getState().tasks).toEqual([
    {
      image: image1,
      options: {
        color: 64,
      },
      status: TaskStatus.PENDING,
    },
    {
      image: image2,
      options: {
        color: 64,
      },
      status: TaskStatus.DONE,
      optimized: {
        id: '03',
        url: '02.png',
        size: 101,
        ext: 'png',
        color: 8,
        originalName: 'file-result.png',
      }
    }
  ])
})

test('task fail', () => {
  const store = createStore(reducer)

  store.dispatch(actions.taskAdd([image1, image2]))
  store.dispatch(actions.taskOptimizeFail(image2.id))
  store.dispatch(actions.taskOptimizeFail('notexist'))

  expect(store.getState().tasks).toEqual([
    {
      image: image1,
      options: {
        color: 64,
      },
      status: TaskStatus.PENDING,
    },
    {
      image: image2,
      options: {
        color: 64,
      },
      status: TaskStatus.FAIL,
      optimized: null,
    }
  ])
})


test('globals', () => {
  const store = createStore(reducer)

  store.dispatch(actions.taskDetail('detailId'))

  expect(store.getState().globals.activeId).toBe('detailId')

  store.dispatch(actions.taskDetail(null))

  expect(store.getState().globals.activeId).toBe(null)
})
