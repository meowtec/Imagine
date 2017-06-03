import * as React from 'react'
import * as ReactDOM from 'react-dom'

export default class Layer extends React.PureComponent<any, {}> {
  root: HTMLDivElement

  componentDidMount () {
    const div = document.createElement('div')
    document.body.appendChild(div)
    this.root = div
    this.renderInBody()
  }

  componentDidUpdate () {
    this.renderInBody()
  }

  componentWillUnmount () {
    ReactDOM.unmountComponentAtNode(this.root)
    document.body.removeChild(this.root)
  }

  renderInBody () {
    const { props } = this

    ReactDOM.render((
      <div {...props}>{props.children}</div>
    ), this.root)
  }

  render (): any {
    return null
  }
}

