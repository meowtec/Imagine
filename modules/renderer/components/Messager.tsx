import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import { Empty } from '../../common/types'
import Icon from './Icon'

import './Messager.less'

interface IMessagerProps {
  message: string
  type?: 'error' | 'warning' | 'success' | 'info'
  onClick?(): void
}

export default class Messager extends PureComponent<IMessagerProps, Empty> {
  render() {
    const { type = 'info', message } = this.props
    let icon = type
    if (icon === 'warning') icon = 'error'

    return (
      <div className={`messager -${type}`}>
        <Icon className="messager-icon" name={icon} />
        {message}
      </div>
    )
  }
}

interface IMessagerManagerState {
  message: IMessagerProps | null
  key: number
}

class MessagerManager extends PureComponent<Empty, IMessagerManagerState> {
  closeTimer = 0

  constructor(props: Empty) {
    super(props)

    this.state = {
      key: 0,
      message: null,
    }
  }

  render() {
    return (
      <TransitionGroup className="global-messager">
        {
          this.state.message
            ? (
              <CSSTransition classNames="messager" timeout={500}>
                <Messager key={this.state.key} {...this.state.message} />
              </CSSTransition>
            ) : null
        }
      </TransitionGroup>
    )
  }

  // eslint-disable-next-line react/no-unused-class-component-methods
  show(options: IMessagerProps & {
    duration?: number
  }) {
    window.clearTimeout(this.closeTimer)

    this.setState((state) => ({
      message: options,
      key: state.key + 1,
    }))

    this.closeTimer = window.setTimeout(() => {
      this.setState({
        message: null,
      })
    }, options.duration || 3000)
  }
}

let hasGroupInstance = false
let messagerManager: MessagerManager | null = null

export const showMessage = (options: string | IMessagerProps & {
  duration?: number
}) => {
  if (!hasGroupInstance) {
    const div = document.createElement('div')
    document.body.appendChild(div)
    ReactDOM.render(
      (
        <MessagerManager ref={(mm) => { messagerManager = mm }} />
      ), div,
    )
    hasGroupInstance = true
  }

  let props: IMessagerProps

  if (typeof options === 'string') {
    props = {
      message: options,
      type: 'info',
    }
  } else {
    props = options
  }

  if (messagerManager) messagerManager.show(props)
}
