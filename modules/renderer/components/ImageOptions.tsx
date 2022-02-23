import React, { PureComponent } from 'react'
import { SupportedExt, IOptimizeOptions, Empty } from '../../common/types'
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

export default class ImageOptions extends PureComponent<ImageOptionsProps, Empty> {
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
        <div>{__('colors')}</div>
        <ColorNumber
          value={this.props.options.color || 0}
          onChange={this.handleColorChange}
          nativeStep={this.props.precision ? 0.1 : 1}
        />
      </div>
    )
  }

  renderJPGWebp() {
    return (
      <div className="image-options">
        <div>{__('quality')}</div>
        <Quality
          value={this.props.options.quality || 0}
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
      default:
    }

    return null
  }
}
