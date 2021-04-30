import React, { PureComponent, ChangeEvent } from 'react'
import classnames from 'classnames'
import { SupportedExt } from '../../common/types'
import Select from './Select'

import './TargetTypeSelect.less'

interface ITargetTypeSelectProps {
  className?: string
  sourceExt: SupportedExt
  targetExt: SupportedExt
  onChange: (ext: SupportedExt) => void
}

class TargetTypeSelect extends PureComponent<ITargetTypeSelectProps, {}> {
  handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    this.props.onChange(e.target.value as SupportedExt)
  }

  render() {
    const {
      className, targetExt,
    } = this.props

    return (
      <Select
        className={classnames('select-ext-type', className)}
        value={targetExt}
        onChange={this.handleChange}
      >
        <option value={SupportedExt.png}>
          To PNG
        </option>
        <option value={SupportedExt.jpg}>To JPG</option>
        <option value={SupportedExt.webp}>To WebP</option>
      </Select>
    )
  }
}

export default TargetTypeSelect
