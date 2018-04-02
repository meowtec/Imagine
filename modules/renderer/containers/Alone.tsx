import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import ImageOptions from '../components/ImageOptions'
import ImageViewer from '../components/ImageViewer'
import Modal from '../components/Modal'
import Icon from '../components/Icon'
import SizeReduce from '../components/SizeReduce'
import RadioGroup from '../components/RadioGroup'
import TargetTypeSelect from '../components/TargetTypeSelect'
import actions from '../store/actionCreaters'
import { IState } from '../store/reducer'
import { getActiveTask } from '../store/selectors'
import {
  ITaskItem,
  IOptimizeOptions,
  TaskStatus,
  IImageFile,
  SupportedExt,
} from '../../common/constants'
import __ from '../../locales'

import './Alone.less'

interface IAloneProps {
  task?: ITaskItem
}

interface IAloneDispatchProps {
  onClose(): void
  onOptionsChange(id: string, options: IOptimizeOptions): void
  onExportChange(id: string, ext: SupportedExt): void
}

const enum ImageStage {
  beforeOptimized = 'before_optimized',
  afterOptimized = 'after_optimized',
}

const imageStageList = [ImageStage.beforeOptimized, ImageStage.afterOptimized]

interface IAloneState {
  imageStage: ImageStage,
}

class Alone extends PureComponent<IAloneProps & IAloneDispatchProps, IAloneState> {
  constructor(props: IAloneProps & IAloneDispatchProps) {
    super(props)

    this.state = {
      imageStage: ImageStage.afterOptimized,
    }
  }

  handleOptionsChange = (options: IOptimizeOptions) => {
    this.props.onOptionsChange(this.props.task!.id, options)
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.keyCode === 27) {
      this.props.onClose()
    }
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeyPress)
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeyPress)
  }

  handleImageStageChange = (value: ImageStage) => {
    this.setState({
      imageStage: value,
    })
  }

  handleExtChange = (ext: SupportedExt) => {
    const task = this.props.task!
    this.props.onExportChange(task.id, ext)
  }

  renderControllers() {
    const task = this.props.task!
    const { image, optimized, options, status } = task
    const exportExt = options.exportExt || image.ext

    return (
      <div>
        { status === TaskStatus.PROCESSING || status === TaskStatus.PENDING
          ? <Icon className="-spin" name="color" />
          : null
        }
        <SizeReduce task={task} />
        <div className="paper alone-options">
          <TargetTypeSelect
            sourceExt={image.ext}
            targetExt={exportExt}
            onChange={this.handleExtChange}
          />
          <ImageOptions
            ext={exportExt}
            options={options}
            precision={true}
            onChange={this.handleOptionsChange}
          />
        </div>
        <RadioGroup
          className="original-check -standard"
          data={imageStageList}
          value={this.state.imageStage}
          renderItem={__}
          onChange={this.handleImageStageChange}
        />
      </div>
    )
  }

  render() {
    const { task } = this.props
    const { imageStage } = this.state

    /**
     * image that show in imageViewew
     */
    let image: IImageFile | undefined
    if (task) {
      image = imageStage === ImageStage.afterOptimized
        ? task.optimized
        : task.image
    }

    return (
      <Modal className="alone-modal" visible={!!task} onClose={this.props.onClose}>
        <ImageViewer src={image && image.url} />
        {
          task && this.renderControllers()
        }
      </Modal>
    )
  }
}

export default connect<IAloneProps, IAloneDispatchProps, {}>((state: IState) => ({
  task: getActiveTask(state),
}), dispatch => ({
  onClose() {
    dispatch(actions.taskDetail(null))
  },
  onOptionsChange(id: string, options: IOptimizeOptions) {
    dispatch(actions.taskUpdateOptions(id, options))
  },
  onExportChange(id: string, ext: SupportedExt) {
    dispatch(actions.taskUpdateExport(id, ext))
  },
}))(Alone)
