import React, { PureComponent } from 'react'
import { ITaskItem } from '../../common/constants'
import * as _ from '../../common/utils'

export default function SizeReduce({ task }: { task: ITaskItem }) {
  const { image, optimized } = task
  const beforeSize = _.size(image.size)

  if (optimized) {
    const afterSize = _.size(optimized.size)
    const percent = _.percent((image.size - optimized.size) / image.size)

    return (
      <div className="size-reduce">
        <span className="size-number">{afterSize[0]}</span>
        <span className="size-unit">{afterSize[1]}</span>
        <span className="size-sep"> / </span>
        <span className="size-number">{beforeSize[0]}</span>
        <span className="size-unit">{beforeSize[1]}</span>
        <span className="size-less">
          <span className="size-q"> (</span>
          { percent >= 0 ? '-' : '+' }
          <span className="size-number">{ Math.abs(percent) }</span>
          <span className="size-unit">%</span>
          <span className="size-q">)</span>
        </span>
      </div>
    )
  }
  return (
    <div className="size-reduce">
      <span className="size-number">{beforeSize[0]}</span>
      <span className="size-unit">{beforeSize[1]}</span>
    </div>
  )
}
