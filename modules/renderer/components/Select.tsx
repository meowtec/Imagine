import * as React from 'react'
import Icon from './Icon'

import './Select.less'

interface SelectProps {
  iconName?: string
}

export default class Select extends React.Component<SelectProps, {}> {
  render () {
    const { children, iconName } = this.props
    return (
      <div className="select">
        {children}
        <Icon name={iconName} />
      </div>
    )
  }

  static defaultProps = {
    iconName: 'select',
  }
}
