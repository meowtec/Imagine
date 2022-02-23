import { PropsWithChildren, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { Empty } from '../../common/types'

export default class Portal extends PureComponent<PropsWithChildren<Empty>, Empty> {
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
