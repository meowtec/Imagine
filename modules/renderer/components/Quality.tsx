import React from 'react'
import Ranger from './Ranger'

interface IQualityProps {
  value: number
  nativeStep: number
  onChange(value: number): void
}

const transformInput = (value: number) => value / 10

const transformOutput = (value: number) => value * 10

export default function Quality(props: IQualityProps) {
  return (
    <Ranger
      min={10}
      max={100}
      value={props.value}
      nativeStep={props.nativeStep}
      onChange={props.onChange}
      transformInput={transformInput}
      transformOutput={transformOutput}
    />
  )
}
