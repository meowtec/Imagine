import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'
import store from './store/store'
import App from './App'

class Main extends React.PureComponent<{}, {}> {
  render () {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    )
  }
}

if (process.env.NODE_ENV === 'development') {
  const render = () => {
    ReactDOM.render(
      <AppContainer>
        <Main />
      </AppContainer>,
      document.getElementById('app')
    )
  }

  render()

  if ((module as any).hot) {
    ;(module as any).hot.accept('./App', () => render())
  }

} else {
  ReactDOM.render(
    <Main />,
    document.getElementById('app')
  )
}

