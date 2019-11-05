import { createStore as _createStore, Action } from 'redux'
import reducer from './reducer'

export function createStore() {
  const { __REDUX_DEVTOOLS_EXTENSION__ } = window as any

  const store = _createStore(
    reducer,
    __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__()
  )

  return store
}

export default createStore()
