import { IImageFile, IOptimizeOptions, IOptimizeRequest, IpcChannel } from '../../common/constants'
import { requestCreater } from './core'

const optimize = requestCreater<IOptimizeRequest, IImageFile>(IpcChannel.OPTIMIZE)

export default optimize
