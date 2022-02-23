import React, {
  PureComponent, ReactInstance, cloneElement, Children, ReactElement,
} from 'react'
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
  popper?: Popperjs

  private enterTimer = -1

  private leaveTimer = -1

  refPopper = React.createRef<HTMLDivElement>()

  refReference = React.createRef<HTMLElement | ReactInstance>()

  static defaultProps = {
    placement: 'bottom',
  }

  state = {
    visible: false,
  }

  componentDidMount() {
    // eslint-disable-next-line react/no-find-dom-node
    const referenceElement = ReactDOM.findDOMNode(this.refReference.current)

    if (!(referenceElement instanceof HTMLElement) || !this.refPopper.current) return

    this.popper = new Popperjs(referenceElement, this.refPopper.current, {
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
    this.popper?.update()
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

  render() {
    const visible = this.props.hoverMode
      ? this.state.visible
      : this.props.visible

    const child = Children.only(this.props.children)

    return (
      <>
        <Portal>
          <div
            className={classnames('popper', this.props.className, {
              '-hidden': !visible,
            })}
            ref={this.refPopper}
            onMouseOver={this.onmouseover}
            onMouseLeave={this.onmouseleave}
          >
            <div className="arrow" />
            {this.props.popper}
          </div>
        </Portal>
        {
          cloneElement(child as ReactElement, {
            ref: this.refReference,
          })
        }
      </>
    )
  }
}
