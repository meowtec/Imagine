import { createStore as _createStore } from 'redux'
import reducer from './reducer'

export function createStore() {
  const { __REDUX_DEVTOOLS_EXTENSION__: reduxExt } = window

  const store = _createStore(
    reducer,
    reduxExt?.(),
  )

  return store
}

export default createStore()
