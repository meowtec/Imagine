import { ImageFile, OptimizeOptions, OptimizeRequest, IpcChannel } from '../../common/constants'
import { requestCreater } from './core'

const optimize = requestCreater<OptimizeRequest, ImageFile>(IpcChannel.OPTIMIZE)

export default optimize
