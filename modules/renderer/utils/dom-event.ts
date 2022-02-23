import { WheelEvent, SyntheticEvent } from 'react'

interface IWheelData {
  type: 'zoom' | 'move'
  zoom: number
  x: number
  y: number
}

export function getWheelFromEvent(wheelEvent: WheelEvent): IWheelData {
  const wheelData: IWheelData = {
    type: 'zoom',
    zoom: 1,
    x: 0,
    y: 0,
  }

  const {
    deltaX, deltaY, ctrlKey,
  } = wheelEvent

  if ((deltaY === 100 || deltaY === -100) && !deltaX) {
    // mouse
    wheelData.type = 'zoom'
    wheelData.zoom = deltaY === 100 ? 1 / 2 : 2
  } else if (ctrlKey) {
    // trackpad
    wheelData.type = 'zoom'
    wheelData.zoom = 1.02 ** -deltaY
  } else {
    wheelData.type = 'move'
    wheelData.x = deltaX
    wheelData.y = deltaY
  }

  return wheelData
}

export function eventOffset(e: MouseEvent, el: HTMLElement) {
  const bounds = el.getBoundingClientRect()
  return {
    x: e.clientX - bounds.left,
    y: e.clientY - bounds.top,
  }
}

export function prevent(e: SyntheticEvent) {
  e.preventDefault()
}
