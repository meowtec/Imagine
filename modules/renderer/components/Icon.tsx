/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
import React, { PureComponent, StatelessComponent } from 'react'
import classnames from 'classnames'
import './Icon.less'

interface IconProps {
  name: string
  className?: string
}

const Icon: StatelessComponent<IconProps> = ({ name, className }) => (
  <svg className={classnames('icon', `icon-${name}`, className)}>
    <use
      xlinkHref={`#icon-${name}`}
    />
  </svg>
)

export default Icon

/**
 * require all symbols/*.svg
 */
;(require as any).context('../images/symbols/', false).keys().map((file: string) => require(`../images/symbols/${file.slice(2)}`))
