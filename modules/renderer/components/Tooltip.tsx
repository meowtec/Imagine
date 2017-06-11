import * as React from 'react'

import './Tooltip.less'

interface ITooltipProps {
  children: React.ReactNode | null
}

export default class Tooltip extends React.PureComponent<ITooltipProps, {}> {
  render() {
    return (
      <div className="tooltip-rel">
        <div className="tooltip">
          <div className="tooltip-content">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
