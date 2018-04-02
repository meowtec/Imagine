import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { SupportedExt, IOptimizeOptions } from '../../common/constants'
import Icon from '../components/Icon'
import Collapse from '../components/Collapse'
import ImageOptions from '../components/ImageOptions'
import TargetTypeSelect from '../components/TargetTypeSelect'
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

class OptionsPanel extends PureComponent<IProps & IDispatchProps, {}> {
  onOptionsChanges = {
    png: this.props.onOptionsChange.bind(null, SupportedExt.png),
    jpg: this.props.onOptionsChange.bind(null, SupportedExt.jpg),
    webp: this.props.onOptionsChange.bind(null, SupportedExt.webp),
  } as {[ext: string]: (options: IOptimizeOptions) => void}

  onExtChanges = (() => {
    const createExtChangeHandler = (ext: SupportedExt) =>
      (exportExt: SupportedExt) =>
        this.props.onOptionsChange(ext, {
          ...this.props.optionsMap[ext],
          exportExt,
        })

    return {
      png: createExtChangeHandler(SupportedExt.png),
      jpg: createExtChangeHandler(SupportedExt.jpg),
    }
  })()

  render() {
    const { optionsMap } = this.props

    return (
      <div className="options">
        <div className="options-body">
          <Collapse title="PNG" initialVisible={true}>
            <div className="collapse-row target-ext-select-row">
              <TargetTypeSelect
                className="target-ext-select"
                onChange={this.onExtChanges.png}
                sourceExt={SupportedExt.png}
                targetExt={optionsMap.png.exportExt || SupportedExt.png}
              />
            </div>
            <div className="collapse-row">
              <ImageOptions
                precision={true}
                ext={SupportedExt.png}
                options={optionsMap.png}
                onChange={this.onOptionsChanges.png}
              />
            </div>
          </Collapse>

          <Collapse title="JPEG" initialVisible={true}>
            <div className="collapse-row target-ext-select-row">
              <TargetTypeSelect
                className="target-ext-select"
                onChange={this.onExtChanges.jpg}
                sourceExt={SupportedExt.jpg}
                targetExt={optionsMap.jpg.exportExt || SupportedExt.jpg}
              />
            </div>
            <div className="collapse-row">
              <ImageOptions
                precision={true}
                ext={SupportedExt.jpg}
                options={optionsMap.jpg}
                onChange={this.onOptionsChanges.jpg}
              />
            </div>
          </Collapse>

          <Collapse title="WebP" initialVisible={true}>
            <div className="collapse-row">
              <ImageOptions
                precision={true}
                ext={SupportedExt.webp}
                options={optionsMap.webp}
                onChange={this.onOptionsChanges.webp}
              />
            </div>
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

export default connect<IProps, IDispatchProps, IOwnProps>(
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
