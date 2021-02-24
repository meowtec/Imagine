import React, { PureComponent } from 'react'
import { range } from 'lodash'
import Ranger from './Ranger'

interface ICorlorNumberProps {
  value: number
  inputReadOnly?: boolean
  nativeStep: number
  onChange(value: number): void
}

const transformInput = (value: number) => Math.log2(value)

const transformOutput = (value: number) => Math.pow(2, value)

export default function CorlorNumber(props: ICorlorNumberProps) {
  return (
    <Ranger
      min={2}
      max={256}
      value={props.value}
      nativeStep={props.nativeStep}
      onChange={props.onChange}
      transformInput={transformInput}
      transformOutput={transformOutput}
    />
  )
}
