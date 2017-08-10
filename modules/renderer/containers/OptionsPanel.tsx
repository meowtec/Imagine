import * as React from 'react'
import { connect } from 'react-redux'
import { SupportedExt, IOptimizeOptions } from '../../common/constants'
import Icon from '../components/Icon'
import Collapse from '../components/Collapse'
import ImageOptions from '../components/ImageOptions'
import { IDefaultOptions, IState } from '../store/reducer'
import actions from '../store/actionCreaters'
import __ from '../../locales'

import './OptionsPanel.less'

interface IProps {
  optionsMap: IDefaultOptions
}

interface IDispatchProps {
  onOptionsChange(ext: SupportedExt, options: IOptimizeOptions): void
  onApplyClick(): void
  onClose(): void
}

interface IOwnProps {
  onApplyClick?(): void
}

class OptionsPanel extends React.PureComponent<IProps & IDispatchProps, {}> {
  render() {
    const { optionsMap } = this.props

    return (
      <div className="options">
        <div className="options-body">
          <Collapse title="PNG" initialVisible={true}>
            <ImageOptions
              precision={true}
              ext={SupportedExt.png}
              options={optionsMap.png}
              onChange={options => this.props.onOptionsChange('png', options)}
            />
          </Collapse>

          <Collapse title="JPEG" initialVisible={true}>
            <ImageOptions
              precision={true}
              ext={SupportedExt.jpg}
              options={optionsMap.jpg}
              onChange={options => this.props.onOptionsChange('jpg', options)}
            />
          </Collapse>
        </div>
        <footer className="clearfix">
          <button onClick={this.props.onApplyClick}>
            <Icon name="doneall" />
            {__('apply_now')}
          </button>
          <div className="blank" />
          <button onClick={this.props.onClose}>
            <Icon name="close" />
          </button>
        </footer>
      </div>
    )
  }
}

export default connect<IProps, IOwnProps, IOwnProps>(
  (state: IState) => ({
    optionsMap: state.globals.defaultOptions,
  }),

  (dispatch, ownProps) => ({
    onOptionsChange(ext: SupportedExt, options: IOptimizeOptions) {
      dispatch(actions.defaultOptions({
        ext,
        options,
      }))
    },

    onApplyClick() {
      dispatch(actions.optionsApply())
      ownProps && ownProps.onApplyClick && ownProps.onApplyClick()
    },

    onClose() {
      dispatch(actions.optionsVisible(false))
    },
  })
)(OptionsPanel)
