import * as React from 'react'
import { connect } from 'react-redux'
import { IState } from '../store/reducer'
import {
  SupportedExt,
} from '../../common/constants'
import __ from '../../locales'

interface ITargetTypeSelectProps {
  sourceExt: SupportedExt
  targetExt: SupportedExt
  imageMagickInstalled: boolean
  onChange: (ext: SupportedExt) => void
}

class TargetTypeSelect extends React.PureComponent<ITargetTypeSelectProps, {}> {
  handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onChange(e.target.value as SupportedExt)
  }

  render() {
    const { sourceExt, targetExt, imageMagickInstalled } = this.props
    const PNGDisabled = sourceExt === SupportedExt.jpg && !imageMagickInstalled

    return (
      <select style={{width: 60}} value={targetExt} onChange={this.handleChange}>
        <option value={SupportedExt.png} disabled={PNGDisabled}>
        PNG { PNGDisabled ? ` (${__('imagemagick_required')})` : ''}
        </option>
        <option value={SupportedExt.jpg}>JPG</option>
        <option value={SupportedExt.webp}>Webp</option>
      </select>
    )
  }
}

export default connect((state: IState) => ({
  imageMagickInstalled: state.globals.imageMagickInstalled,
}))(TargetTypeSelect)
