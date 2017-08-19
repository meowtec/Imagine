import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as CSSTransition from 'react-transition-group/CSSTransition'
import * as TransitionGroup from 'react-transition-group/TransitionGroup'
import * as classnames from 'classnames'
import Icon from './Icon'
import { sleep } from '../../common/utils'

import './Messager.less'

interface IMessagerProps {
  message: string
  type?: 'error' | 'warning' | 'success' | 'info'
  onClick?(): void
}

export default class Messager extends React.PureComponent<IMessagerProps, {}> {
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

class MessagerManager extends React.PureComponent<{}, IMessagerManagerState> {
  closeTimer: any

  constructor() {
    super()

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

  show(options: IMessagerProps & {
    duration?: number
  }) {
    clearTimeout(this.closeTimer)

    this.setState({
      message: options,
      key: this.state.key + 1,
    })

    this.closeTimer = setTimeout(() => {
      this.setState({
        message: null,
      })
    }, options.duration || 3000)
  }
}

let hasGroupInstance = false
let messagerManager: MessagerManager

export const showMessage = (options: string | IMessagerProps & {
  duration?: number
}) => {
  if (!hasGroupInstance) {
    const div = document.createElement('div')
    document.body.appendChild(div)
    ReactDOM.render((
      <MessagerManager ref={mm => {messagerManager = mm!}} />
    ), div)
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
