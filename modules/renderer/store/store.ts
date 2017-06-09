import { createStore } from 'redux'
import reducer from './reducer'
import Daemon from './daemon'
import listenPush from './push'

const { __REDUX_DEVTOOLS_EXTENSION__ } = window as any

const store = createStore(reducer, __REDUX_DEVTOOLS_EXTENSION__ && __REDUX_DEVTOOLS_EXTENSION__())

const daemon = new Daemon()
daemon.watch(store)
listenPush(store)

export default store
