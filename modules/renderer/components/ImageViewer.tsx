import * as React from 'react'
import { PureComponent, SyntheticEvent } from 'react'
import * as classnames from 'classnames'
import { consumWheelEvent, eventOffset } from '../utils/dom-event'
import { coop } from '../../common/utils'
import RadioGroup from './RadioGroup'
import Icon from './Icon'

import './ImageViewer.less'

interface ImageViewerProps {
  src?: string
  width?: number
  height?: number
}

interface ImageViewerState {
  imageNaturalWidth: number
  imageNaturalHeight: number
  zoom: number
  x: number
  y: number
  material: string
  imageError: boolean
}

const ZOOM_MIN = 1 / 8
const ZOOM_MAX = 16

const zoomCoop = coop(ZOOM_MIN, ZOOM_MAX)

const roundZoom = (zoom: number) => {
  return Math.pow(2, Math.round(Math.log2(zoom)))
}

const floorZoom = (zoom: number) => {
  return Math.pow(2, Math.floor(Math.log2(zoom)))
}

const materials = [
  'gradient',
  'transparent',
  'white',
  'black',
  'red',
  'blue',
  'yellow',
]

export default class ImageViewer extends PureComponent<ImageViewerProps, ImageViewerState> {

  private image?: HTMLImageElement
  private backdrop?: HTMLDivElement
  private prevScreenX = 0
  private prevScreenY = 0
  private dragging = false

  constructor() {
    super()

    this.state = {
      imageNaturalWidth: 0,
      imageNaturalHeight: 0,
      zoom: 1,
      x: 0,
      y: 0,
      material: materials[0],
      imageError: false,
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }

  private imageSize() {
    let { width, height } = this.props
    if (!(width && height)) {
      width = this.state.imageNaturalWidth
      height = this.state.imageNaturalHeight
    }

    return {
      width,
      height,
    }
  }

  private initialZoom() {
    if (!this.image) {
      return 1
    }

    const { naturalWidth, naturalHeight } = this.image
    const { clientWidth, clientHeight } = this.backdrop!

    return floorZoom(Math.min(clientWidth / naturalWidth, clientHeight / naturalHeight) * 0.9)
  }

  handleImageLoad = () => {
    const { naturalWidth, naturalHeight } = this.image!

    this.setState({
      imageNaturalWidth: naturalWidth,
      imageNaturalHeight: naturalHeight,
      imageError: false,
    })

    if (!this.state.imageNaturalWidth) {
      this.setState({
        zoom: this.initialZoom(),
      })
    }
  }

  handleImageError = () => {
    this.setState({
      imageError: true,
    })
  }

  handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    this.dragging = true
    this.prevScreenX = e.screenX
    this.prevScreenY = e.screenY
  }

  handleMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return

    const { screenX, screenY } = e
    this.setState({
      x: this.state.x + screenX - this.prevScreenX,
      y: this.state.y + screenY - this.prevScreenY,
    })

    this.prevScreenX = screenX
    this.prevScreenY = screenY
  }

  handleMouseUp = (e: MouseEvent) => {
    this.dragging = false
  }

  handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault()

    const wheelData = consumWheelEvent(e)
    const { state } = this

    if (wheelData.type === 'zoom') {
      const target = e.currentTarget
      const mousePosition = eventOffset(e.nativeEvent, target)

      const zoom = zoomCoop(state.zoom * wheelData.zoom)
      const mouseX = mousePosition.x - target.clientWidth / 2
      const x = mouseX - (mouseX - state.x) / state.zoom * zoom
      const mouseY = mousePosition.y - target.clientHeight / 2
      const y = mouseY - (mouseY - state.y) / state.zoom * zoom

      this.setState({
        x, y, zoom,
      })
    } else {
      this.setState({
        x: state.x - wheelData.x,
        y: state.y - wheelData.y,
      })
    }
  }

  handleZoomOut = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()

    const { x, y, zoom } = this.state
    this.setState({
      zoom: roundZoom(zoom * 2),
      x: 0,
      y: 0,
    })
  }

  handleZoomIn = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()

    const { x, y, zoom } = this.state
    this.setState({
      zoom: roundZoom(zoom / 2),
      x: 0,
      y: 0,
    })
  }

  handleFocusCenter = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()

    this.setState({
      x: 0,
      y: 0,
      zoom: this.initialZoom(),
    })
  }

  handleMaterialChange = (value: string) => {
    this.setState({
      material: value,
    })
  }

  renderMaterialItem(material: string) {
    return <div className={classnames('material-cube', '-' + material)} />
  }

  renderContent() {
    const {
      zoom,
      x,
      y,
      imageError,
    } = this.state

    if (imageError) {
      return <div className="image-fail">FAILED</div>
    }

    if (this.props.src) {
      return (
        <img
          className="image -transition"
          src={this.props.src}
          onLoad={this.handleImageLoad}
          onError={this.handleImageError}
          ref={el => {this.image = el!}}
          style={{
            transform: `translate(${x}px, ${y}px) scale(${zoom})`,
          }}
        />
      )
    } else {
      this.image = undefined
    }

    return null
  }

  render() {
    const {
      zoom,
      x,
      y,
      material,
    } = this.state

    const { width, height } = this.imageSize()
    return (
      <div
        className="backdrop"
        onWheel={this.handleWheel}
        ref={el => {this.backdrop = el!}}
      >
        <div className={classnames('material-wall', '-' + material)}></div>
        <div
          className="image-wrapper"
          onMouseDown={this.handleMouseDown}
        >
          {
            this.renderContent()
          }
        </div>

        <div className="zoom-control">
          <button className="paper" onClick={this.handleFocusCenter}>
            <Icon name="focus" />
          </button>
          <button className="paper" onClick={this.handleZoomOut} disabled={zoom >= ZOOM_MAX}>+</button>
          <button className="paper" onClick={this.handleZoomIn} disabled={zoom <= ZOOM_MIN}>-</button>
        </div>

        <RadioGroup
          className="material-list"
          data={materials}
          value={material}
          renderItem={this.renderMaterialItem}
          onChange={this.handleMaterialChange}
        />
      </div>
    )
  }
}
