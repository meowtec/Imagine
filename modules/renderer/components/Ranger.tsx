import * as React from 'react'
import { range } from 'lodash'
import * as _ from '../../common/utils'

import './Ranger.less'

interface IRangerProps {
  value: number
  max: number
  min: number
  nativeStep: number
  inputReadOnly?: boolean
  transformInput?(value: number): number
  transformOutput?(value: number): number
  onChange(value: number): void
}

const pass = (x: any) => x

export default class Ranger extends React.PureComponent<IRangerProps, any> {
  fixValue(value: number) {
    const { max, min } = this.props

    return ~~_.coop2(min, max, value)
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: HTMLInputElement = e.target
    const { value } = input
    const { transformOutput } = this.props

    this.props.onChange(this.fixValue(transformOutput(Number(value))))
  }

  handleNumberInputChange  = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(this.fixValue(~~e.target.value))
  }

  render() {
    const { min, max, value, transformInput, transformOutput, nativeStep } = this.props
    const nativeValue = transformInput(value)

    return (
      <div className="ranger">
        <input
          type="range"
          value={nativeValue}
          min={transformInput(min)}
          max={transformInput(max)}
          step={nativeStep}
          onChange={this.handleInputChange}
        />
        <input
          type="number"
          readOnly={this.props.inputReadOnly}
          value={value}
          onChange={this.handleNumberInputChange}
        />
      </div>
    )
  }

  static defaultProps = {
    transformInput: pass,
    transformOutput: pass,
  }
}
