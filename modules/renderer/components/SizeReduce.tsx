import * as React from 'react'
import { TaskItem } from '../../common/constants'
import * as _ from '../../common/utils'

export default function SizeReduce ({ task }: { task: TaskItem }) {
  const { image, optimized } = task
  const beforeSize = _.size(image.size)
  const afterSize = optimized && _.size(optimized.size)

  if (optimized) {
    return (
      <div className="size-reduce">
        <span className="size-number">{afterSize[0]}</span>
        <span className="size-unit">{afterSize[1]}</span>
        <span className="size-sep">/</span>
        <span className="size-number">{beforeSize[0]}</span>
        <span className="size-unit">{beforeSize[1]}</span>
        <span className="size-less">
          <span className="size-q">(</span>
          -
          <span className="size-number">{
            _.percent((image.size - optimized.size) / image.size)
          }</span>
          <span className="size-unit">%</span>
          <span className="size-q">)</span>
        </span>
      </div>
    )
  } else {
    return (
      <div className="size-reduce">
        <span className="size-number">{beforeSize[0]}</span>
        <span className="size-unit">{beforeSize[1]}</span>
      </div>
    )
  }
}
