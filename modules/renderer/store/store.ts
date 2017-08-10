import { createStore as _createStore } from 'redux'
import { setStore } from './actionCreaters'
import reducer, { IState } from './reducer'

export function createStore() {
  const { __REDUX_DEVTOOLS_EXTENSION__ } = window as any

  const store = _createStore<IState>(
    reducer,
    __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__()
  )

  // actionCreaters will visit store directly
  setStore(store)

  return store
}

export default createStore()
