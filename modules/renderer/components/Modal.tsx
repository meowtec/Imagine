import * as React from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import * as classnames from 'classnames'
import Root from './Root'
import Icon from './Icon'

import './Modal.less'

interface IModalProps {
  visible: boolean
  className?: string
  onClose?(): void
}

export default class Modal extends React.PureComponent<IModalProps, {}> {
  render() {
    return (
      <Root className={classnames('modal-container', this.props.className)}>
        <CSSTransitionGroup
          transitionName="modal"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
          component="div"
        >
          {
            this.props.visible ? (
              <div className="modal">
                <button className="close" onClick={this.props.onClose}>
                  <Icon name="close"/>
                </button>
                {this.props.children}
              </div>
            ) : null
          }
        </CSSTransitionGroup>
      </Root>
    )
  }
}
