import * as React from 'react'
import { PureComponent, SyntheticEvent } from 'react'
import { consumWheelEvent, eventOffset } from '../utils/dom-event'
import { coop } from '../../common/utils'
import Icon from './Icon'

import './ImageViewer.less'

interface ImageViewerProps {
  src: string
  width?: number
  height?: number
}

interface ImageViewerState {
  imageNaturalWidth: number
  imageNaturalHeight: number
  zoom: number
  x: number
  y: number
  zoomCenterOffsetX: number
  zoomCenterOffsetY: number
}

const ZOOM_MIN = 0.125
const ZOOM_MAX = 4

const zoomCoop = coop(ZOOM_MIN, ZOOM_MAX)

const roundZoom = (zoom: number) => {
  return Math.pow(2, Math.round(Math.log2(zoom)))
}

export default class ImageViewer extends PureComponent<ImageViewerProps, ImageViewerState> {

  image: HTMLImageElement
  prevScreenX: number
  prevScreenY: number
  dragging = false

  constructor () {
    super()

    this.state = {
      imageNaturalWidth: 0,
      imageNaturalHeight: 0,
      zoom: 1,
      x: 0,
      y: 0,
      zoomCenterOffsetX: 0,
      zoomCenterOffsetY: 0,
    }
  }

  componentDidMount () {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  private imageSize () {
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

  handleImageLoad = () => {
    const { image } = this
    this.setState({
      imageNaturalWidth: image.naturalWidth,
      imageNaturalHeight: image.naturalHeight,
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
      const originX = mousePosition.x - target.clientWidth / 2 - state.x
      const originY = mousePosition.y - target.clientHeight / 2 - state.y

      this.setState({
        zoom: zoomCoop(state.zoom * wheelData.zoom),
        zoomCenterOffsetX: originX,
        zoomCenterOffsetY: originY,
        x: state.x - (originX - state.zoomCenterOffsetX) * (1 - state.zoom),
        y: state.y - (originY - state.zoomCenterOffsetY) * (1 - state.zoom),
      })
    } else {
      this.setState({
        x: state.x - wheelData.x,
        y: state.y - wheelData.y,
      })
    }
  }

  handleZoomOut = () => {
    const { x, y, zoom, zoomCenterOffsetX, zoomCenterOffsetY } = this.state
    this.setState({
      zoom: roundZoom(zoom * 2),
      zoomCenterOffsetX: 0,
      zoomCenterOffsetY: 0,
      x: x + zoomCenterOffsetX * (1 - zoom),
      y: y + zoomCenterOffsetY * (1 - zoom),
    })
  }

  handleZoomIn = () => {
    const { x, y, zoom, zoomCenterOffsetX, zoomCenterOffsetY } = this.state
    this.setState({
      zoom: roundZoom(zoom / 2),
      zoomCenterOffsetX: 0,
      zoomCenterOffsetY: 0,
      x: x + zoomCenterOffsetX * (1 - zoom),
      y: y + zoomCenterOffsetY * (1 - zoom),
    })
  }

  handleFocusCenter = () => {
    this.setState({
      x: 0,
      y: 0,
      zoomCenterOffsetX: 0,
      zoomCenterOffsetY: 0,
      zoom: 1,
    })
  }

  render () {
    const {
      zoom,
      x,
      y,
      zoomCenterOffsetX,
      zoomCenterOffsetY,
    } = this.state

    const { width, height } = this.imageSize()

    const originX = width / 2 + zoomCenterOffsetX
    const originY = height / 2 + zoomCenterOffsetY

    const transformOrigin = `${originX}px ${originY}px`

    return (
      <div
        className="backdrop"
        onWheel={this.handleWheel}
      >
        <div
          className="image-wrapper"
          onMouseDown={this.handleMouseDown}
        >
          <img
            className="image"
            src={this.props.src}
            onLoad={this.handleImageLoad}

            ref={el => {this.image = el}}
            style={{
              transform: `translate(${x}px, ${y}px) scale(${zoom})`,
              transformOrigin,
            }}
          />
        </div>

        <div className="zoom-control">
          <button className="paper" onClick={this.handleFocusCenter}>
            <Icon name="focus" />
          </button>
          <button className="paper" onClick={this.handleZoomOut} disabled={zoom >= ZOOM_MAX}>+</button>
          <button className="paper" onClick={this.handleZoomIn} disabled={zoom <= ZOOM_MIN}>-</button>
        </div>
      </div>
    )
  }
}
