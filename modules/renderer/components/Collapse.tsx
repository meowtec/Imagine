import React, { PureComponent } from 'react'
import classnames from 'classnames'
import './Collapse.less'

interface ICollapseProps {
  title: string
  initialVisible?: boolean
}

interface ICollapseState {
  visible: boolean
}

export default class Collapse extends PureComponent<ICollapseProps, ICollapseState> {
  constructor(props: ICollapseProps) {
    super(props)

    this.state = {
      visible: props.initialVisible || false,
    }
  }

  handleClick = () => {
    this.setState({
      visible: !this.state.visible,
    })
  }

  render() {
    return (
      <div className={classnames('collapse', {
        '-hide': !this.state.visible,
      })}
      >
        <h3 className="collapse-title" onClick={this.handleClick}>
          {this.props.title}
        </h3>
        <div className="collapse-content">
          {this.props.children}
        </div>
      </div>
    )
  }
}
