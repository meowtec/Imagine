import * as React from 'react'
import CorlorNumber from '../components/ColorNumber'
import { bindActionCreators } from 'redux'
import { connect, Dispatch } from 'react-redux'
import { State } from '../store/reducer'
import { actions } from '../store/actions'
import './Worktop.less'

interface WorktopProps {
  totalSize: number
  optimizedSize: number
  color: number
  updateColor(value: number): void
}

class Worktop extends React.PureComponent<WorktopProps, any> {
  render () {
    const { optimizedSize, totalSize } = this.props

    return (
      <div className="worktop">
        <div className="paper">
          <CorlorNumber value={this.props.color} onChange={this.props.updateColor} />
        </div>
        <div className="paper size-display">
          {optimizedSize}bytes / {totalSize}bytes = {(optimizedSize / totalSize * 100).toFixed(1)}%
        </div>
      </div>
    )
  }
}
