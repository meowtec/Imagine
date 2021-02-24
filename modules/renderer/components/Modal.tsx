import React, { PureComponent } from 'react'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import classnames from 'classnames'
import Portal from './Portal'
import Icon from './Icon'

import './Modal.less'

interface IModalProps {
  visible: boolean
  className?: string
  onClose?(): void
}

export default class Modal extends PureComponent<IModalProps, {}> {
  render() {
    return (
      <Portal>
        <TransitionGroup
          className={classnames('modal-container', this.props.className)}
        >
          {
            this.props.visible ? (
              <CSSTransition classNames="modal" timeout={500}>
                <div className="modal">
                  <button className="close" onClick={this.props.onClose}>
                    <Icon name="close" />
                  </button>
                  {this.props.children}
                </div>
              </CSSTransition>
            ) : null
          }
        </TransitionGroup>
      </Portal>
    )
  }
}
