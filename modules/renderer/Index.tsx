import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import store from './store/store'
import App from './App'

if (process.env.NODE_ENV === 'development') {
  const render = () => {
    ReactDOM.render(
      <AppContainer>
        <App />
      </AppContainer>,
      document.getElementById('app')
    )
  }

  if ((module as any).hot) {
    ;(module as any).hot.accept('./App', render)
  }

  render()

} else {
  ReactDOM.render(
    <App />,
    document.getElementById('app')
  )
}

