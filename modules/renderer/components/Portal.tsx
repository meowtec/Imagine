import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '../store/store'

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer

export default class Portal extends PureComponent<{}, {}> {
  $$root = document.createElement('div')

  componentDidMount() {
    document.body.appendChild(this.$$root)
  }

  componentWillUnmount() {
    document.body.removeChild(this.$$root)
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.$$root)
  }
}
