import * as React from 'react'
import { SupportedExt, IOptimizeOptions } from '../../common/constants'
import ColorNumber from './ColorNumber'
import Quality from './Quality'

interface ImageOptionsProps {
  ext: SupportedExt
  options: IOptimizeOptions
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
        <ColorNumber value={this.props.options.color} onChange={this.handleColorChange} />
      </div>
    )
  }

  renderJPG() {
    return (
      <div className="image-options">
        <Quality value={this.props.options.quality} onChange={this.handleQualityChange} />
      </div>
    )
  }

  render() {
    const { ext } = this.props

    switch (ext) {
      case SupportedExt.jpg:
        return this.renderJPG()

      case SupportedExt.png:
        return this.renderPNG()
    }
  }
}
