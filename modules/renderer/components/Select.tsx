import React, { DetailedHTMLProps, SelectHTMLAttributes } from 'react'
import classnames from 'classnames'
import Icon from './Icon'

import './Select.less'

type ReactSelectProps = DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>

interface ISelectProps extends ReactSelectProps {
  className?: string
  iconName?: string
}

export default function Select({
  style,
  className,
  iconName = 'select',
  ...props
}: ISelectProps) {
  return (
    <div
      style={style}
      className={classnames('select', className)}
    >
      <select {...props}>
        {props.children}
      </select>
      <Icon name={iconName} />
    </div>
  )
}
