import * as React from 'react'
import { range } from 'lodash'
import Ranger from './Ranger'

interface QualityProps {
  value: number
  inputReadOnly?: boolean
  onChange (value: number): void
}

const transformInput = (value: number) => value / 10

const transformOutput =  (value: number) => value * 10

export default function Quality (props: QualityProps) {
  return (
    <Ranger
      min={10}
      max={100}
      value={props.value}
      onChange={props.onChange}
      transformInput={transformInput}
      transformOutput={transformOutput}
    />
  )
}
