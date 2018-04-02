import * as os from 'os'
import * as React from 'react'
import * as classnames from 'classnames'
import { connect } from 'react-redux'
import { IState } from '../store/reducer'
import { SupportedExt } from '../../common/constants'
import Select from '../components/select'
import __ from '../../locales'

import './TargetTypeSelect.less'

interface ITargetTypeSelectProps {
  className?: string
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
    const { className, sourceExt, targetExt, imageMagickInstalled } = this.props

    /**
     * on the Mac, pngquant can read JPEG, so we don't need ImageMagick
     * on other systems, ImageMagick should be installed independently
     */
    const PNGDisabled =
      os.platform() !== 'darwin' &&
      sourceExt === SupportedExt.jpg &&
      !imageMagickInstalled

    return (
      <Select
        className={classnames('select-ext-type', className)}
        value={targetExt}
        onChange={this.handleChange}
      >
        <option value={SupportedExt.png} disabled={PNGDisabled}>
        To PNG { PNGDisabled ? ` (${__('imagemagick_required')})` : ''}
        </option>
        <option value={SupportedExt.jpg}>To JPG</option>
        <option value={SupportedExt.webp}>To WebP</option>
      </Select>
    )
  }
}

export default connect((state: IState) => ({
  imageMagickInstalled: state.globals.imageMagickInstalled,
}))(TargetTypeSelect)
