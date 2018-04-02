import React, { PureComponent, ReactInstance, cloneElement, Children, ReactElement } from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import Popperjs from 'popper.js'
import Portal from './Portal'

import './Popper.less'

interface IPopperProps {
  popper: ReactElement<any>
  placement?: string
  hoverMode?: boolean
  visible?: boolean
  className?: string
}

interface IPopperState {
  visible: boolean
}

export default class Popper extends PureComponent<IPopperProps, IPopperState> {
  popperElement?: HTMLDivElement
  referenceElement?: HTMLElement | ReactInstance
  popper?: Popperjs
  private enterTimer = -1
  private leaveTimer = -1

  $refs = {
    popperElement: (el: HTMLDivElement | null) => {
      this.popperElement = el || undefined
    },

    referenceElement: (el: HTMLElement | ReactInstance) => {
      this.referenceElement = el
    },
  }

  state = {
    visible: false,
  }

  componentDidMount() {
    const referenceElement = ReactDOM.findDOMNode(this.referenceElement!)

    this.popper = new Popperjs(referenceElement, this.popperElement!, {
      placement: this.props.placement as any,
      modifiers: {
        arrow: {
          element: '.arrow',
        },
      },
    })

    if (this.props.hoverMode) {
      referenceElement.addEventListener('mouseover', this.onmouseover)
      referenceElement.addEventListener('mouseleave', this.onmouseleave)
    }
  }

  componentDidUpdate() {
    this.popper!.update()
  }

  onmouseover = () => {
    clearTimeout(this.leaveTimer)

    this.enterTimer = window.setTimeout(() => {
      this.setState({
        visible: true,
      })
    }, 200)
  }

  onmouseleave = () => {
    clearTimeout(this.enterTimer)

    this.leaveTimer = window.setTimeout(() => {
      this.setState({
        visible: false,
      })
    }, 200)
  }

  static defaultProps = {
    placement: 'bottom',
  }

  render() {
    const visible = this.props.hoverMode
      ? this.state.visible
      : this.props.visible

    return (
      <>
        <Portal>
          <div
            className={classnames('popper', this.props.className, {
              '-hidden': !visible,
            })}
            ref={this.$refs.popperElement}
            onMouseOver={this.onmouseover}
            onMouseLeave={this.onmouseleave}
          >
            <div className="arrow"></div>
            {this.props.popper}
          </div>
        </Portal>
        {
          cloneElement(Children.only(this.props.children), {
            ref: this.$refs.referenceElement,
          })
        }
      </>
    )
  }
}
