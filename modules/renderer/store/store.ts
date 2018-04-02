import { createStore as _createStore } from 'redux'
import reducer, { IState } from './reducer'

export function createStore() {
  const { __REDUX_DEVTOOLS_EXTENSION__ } = window as any

  const store = _createStore<IState>(
    reducer,
    __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__()
  )

  return store
}

export default createStore()
