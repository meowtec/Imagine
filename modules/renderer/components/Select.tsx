import React, { Component, DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import classnames from 'classnames'
import Icon from './Icon'
import { unpick } from '../../common/utils'

import './Select.less'

type ReactSelectProps = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>

interface ISelectProps extends ReactSelectProps {
  className?: string
  iconName?: string
}

export default class Select extends Component<ISelectProps, {}> {
  render() {
    const { props } = this
    const selectProps = unpick(this.props, [
      'style',
      'className',
      'iconName',
    ])

    return (
      <div
        style={props.style}
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
