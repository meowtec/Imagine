/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React from 'react'
import classnames from 'classnames'
import '../images/symbols'
import './Icon.less'

interface IconProps {
  name: string
  className?: string
}

export default function Icon({ name, className }: IconProps) {
  return (
    <svg className={classnames('icon', `icon-${name}`, className)}>
      <use
        xlinkHref={`#icon-${name}`}
      />
    </svg>
  )
}
