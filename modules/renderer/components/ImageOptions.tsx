import * as React from 'react'
import { shallowCompare } from '../../common/utils'
import { SupportedExt, IOptimizeOptions } from '../../common/constants'
import ColorNumber from './ColorNumber'
import Quality from './Quality'
import __ from '../../locales'

import './ImageOptions.less'

interface ImageOptionsProps {
  ext: SupportedExt
  options: IOptimizeOptions
  precision: boolean
  onChange(options: IOptimizeOptions): void
}

export default class ImageOptions extends React.PureComponent<ImageOptionsProps, {}> {
  handleColorChange = (color: number) => {
    this.props.onChange({
      ...this.props.options,
      color,
    })
  }

  handleQualityChange = (quality: number) => {
    this.props.onChange({
      ...this.props.options,
      quality,
    })
  }

  renderPNG() {
    return (
      <div className="image-options">
        <label>{__('colors')}</label>
        <ColorNumber
          value={this.props.options.color!}
          onChange={this.handleColorChange}
          nativeStep={this.props.precision ? 0.1 : 1}
        />
      </div>
    )
  }

  renderJPGWebp() {
    return (
      <div className="image-options">
        <label>{__('quality')}</label>
        <Quality
          value={this.props.options.quality!}
          onChange={this.handleQualityChange}
          nativeStep={this.props.precision ? 0.1 : 1}
        />
        <span className="percent-symbol">%</span>
      </div>
    )
  }

  render() {
    const { ext } = this.props

    switch (ext) {
      case SupportedExt.jpg:
      case SupportedExt.webp:
        return this.renderJPGWebp()

      case SupportedExt.png:
        return this.renderPNG()
    }

    return null
  }
}
