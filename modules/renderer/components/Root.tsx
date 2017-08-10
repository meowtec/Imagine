import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '../store/store'

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer

export default class Layer<P, S> extends React.PureComponent<P, S> {
  $root: HTMLDivElement

  popperDidMount() {/**/}
  popperDidUpdate() {/**/}

  componentDidMount() {
    const div = document.createElement('div')
    document.body.appendChild(div)
    this.$root = div

    renderSubtreeIntoContainer(this, this.renderElement(), div, () => {
      this.popperDidMount()
    })
  }

  componentDidUpdate() {
    renderSubtreeIntoContainer(this, this.renderElement(), this.$root, () => {
      this.popperDidUpdate()
    })
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.$root)
    document.body.removeChild(this.$root)
  }

  renderElement(): React.ReactElement<any> {
    return React.Children.only(this.props.children)
  }

  render(): React.ReactElement<any> | null {
    return null
  }
}
