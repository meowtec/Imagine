import * as React from 'react'
import { range } from 'lodash'
import Ranger from './Ranger'

interface ICorlorNumberProps {
  value: number
  inputReadOnly?: boolean
  onChange(value: number): void
}

const transformInput = (value: number) => Math.log2(value)

const transformOutput =  (value: number) => Math.pow(2, value)

export default function CorlorNumber(props: ICorlorNumberProps) {
  return (
    <Ranger
      min={2}
      max={256}
      value={props.value}
      onChange={props.onChange}
      transformInput={transformInput}
      transformOutput={transformOutput}
    />
  )
}
