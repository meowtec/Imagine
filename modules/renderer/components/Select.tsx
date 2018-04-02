import * as React from 'react'
import * as classnames from 'classnames'
import Icon from './Icon'
import { unpick } from '../../common/utils'

import './Select.less'

type ReactSelectProps = React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>

interface ISelectProps extends ReactSelectProps {
  className?: string
  iconName?: string
}

export default class Select extends React.Component<ISelectProps, {}> {
  render() {
    const { props } = this
    const selectProps = unpick(this.props, [
      'style',
      'className',
      'iconName',
    ])

    return (
      <div
        style={ props.style }
        className={classnames('select', props.className)}
      >
        <select {...selectProps}>
          {props.children}
        </select>
        <Icon name={props.iconName!} />
      </div>
    )
  }

  static defaultProps = {
    iconName: 'select',
  }
}
