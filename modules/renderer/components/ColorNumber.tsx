import * as React from 'react'
import { range } from 'lodash'
import * as _ from '../../common/utils'

import './ColorNumber.less'

const colorsCoop= _.coop(2, 256)

interface CorlorNumberProps {
  value: number
  inputReadOnly?: boolean
  onChange: (value: number) => void
}

export default class CorlorNumber extends React.PureComponent<CorlorNumberProps, any> {
  private datalistId = 'datalist-' + _.randomId()

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input: HTMLInputElement = e.target
    const { value } = input

    this.props.onChange(Math.round(Math.pow(2, Number(value))))
  }

  handleNumberInputChange  = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(colorsCoop(~~e.target.value))
  }

  render () {
    return (
      <div className="color-number">
        <input
          value={Math.log2(this.props.value)}
          type="range"
          list={this.datalistId}
          min={1}
          max={8}
          step={0.1}
          onChange={this.handleInputChange}
        />
        <datalist id={this.datalistId}>
          {
            range(1, 9).map(x => <option key={x} value={x}>{Math.pow(2, x)}</option>)
          }
        </datalist>
        <input type="number"
          readOnly={this.props.inputReadOnly}
          value={this.props.value}
          onChange={this.handleNumberInputChange}
        />
        <label>
          Colors
        </label>
      </div>
    )
  }
}
