import * as React from 'react'
import { PureComponent, SyntheticEvent } from 'react'
import * as classnames from 'classnames'
import { consumWheelEvent, eventOffset } from '../utils/dom-event'
import { coop } from '../../common/utils'
import RadioGroup from './RadioGroup'
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
  material: string
}

const ZOOM_MIN = 0.125
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
  // 'green',
  'blue',
  'yellow',
]

export default class ImageViewer extends PureComponent<ImageViewerProps, ImageViewerState> {

  image: HTMLImageElement
  backdrop: HTMLDivElement
  prevScreenX: number
  prevScreenY: number
  dragging = false

  constructor() {
    super()

    this.state = {
      imageNaturalWidth: 0,
      imageNaturalHeight: 0,
      zoom: 1,
      x: 0,
      y: 0,
      zoomCenterOffsetX: 0,
      zoomCenterOffsetY: 0,
      material: materials[0],
    }
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
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
    const { naturalWidth, naturalHeight } = this.image
    const { clientWidth, clientHeight } = this.backdrop

    return floorZoom(Math.min(clientWidth / naturalWidth, clientHeight / naturalHeight) * 0.9)
  }

  handleImageLoad = () => {
    const { naturalWidth, naturalHeight } = this.image

    if (!this.state.imageNaturalWidth) {
      this.setState({
        imageNaturalWidth: naturalWidth,
        imageNaturalHeight: naturalHeight,
        zoom: this.initialZoom(),
      })
    }
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
      const zoomCenterOffsetX = (
        mousePosition.x - target.clientWidth / 2 - state.x - state.zoomCenterOffsetX
      ) / state.zoom + state.zoomCenterOffsetX
      const zoomCenterOffsetY = (
        mousePosition.y - target.clientHeight / 2 - state.y - state.zoomCenterOffsetY
      ) / state.zoom + state.zoomCenterOffsetY
      const x = state.x - (zoomCenterOffsetX - state.zoomCenterOffsetX) * (1 - state.zoom)
      const y = state.y - (zoomCenterOffsetY - state.zoomCenterOffsetY) * (1 - state.zoom)

      this.setState({
        zoom,
        zoomCenterOffsetX,
        zoomCenterOffsetY,
        x,
        y,
      })
    } else {
      this.setState({
        x: state.x - wheelData.x,
        y: state.y - wheelData.y,
      })
    }
  }

  // to fix
  handleZoomOut = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()

    const { x, y, zoom, zoomCenterOffsetX, zoomCenterOffsetY } = this.state
    this.setState({
      zoom: roundZoom(zoom * 2),
      zoomCenterOffsetX: 0,
      zoomCenterOffsetY: 0,
      x: x + zoomCenterOffsetX * (1 - zoom),
      y: y + zoomCenterOffsetY * (1 - zoom),
    })
  }

  handleZoomIn = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()

    const { x, y, zoom, zoomCenterOffsetX, zoomCenterOffsetY } = this.state
    this.setState({
      zoom: roundZoom(zoom / 2),
      zoomCenterOffsetX: 0,
      zoomCenterOffsetY: 0,
      x: x + zoomCenterOffsetX * (1 - zoom),
      y: y + zoomCenterOffsetY * (1 - zoom),
    })
  }

  handleFocusCenter = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()

    this.setState({
      x: 0,
      y: 0,
      zoomCenterOffsetX: 0,
      zoomCenterOffsetY: 0,
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

  render() {
    const {
      zoom,
      x,
      y,
      zoomCenterOffsetX,
      zoomCenterOffsetY,
      material,
    } = this.state

    const { width, height } = this.imageSize()

    const originX = width / 2 + zoomCenterOffsetX
    const originY = height / 2 + zoomCenterOffsetY

    const transformOrigin = `${originX}px ${originY}px`

    return (
      <div
        className="backdrop"
        onWheel={this.handleWheel}
        ref={el => {this.backdrop = el}}
      >
        <div className={classnames('material-wall', '-' + material)}></div>
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

        <RadioGroup
          className="material-list"
          data={materials}
          value={material}
          renderItem={this.renderMaterialItem}
          onChange={this.handleMaterialChange}
        ></RadioGroup>
      </div>
    )
  }
}
