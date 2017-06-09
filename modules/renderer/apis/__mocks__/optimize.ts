import { sleep } from '../../../common/utils'
import { IImageFile, IOptimizeOptions, IOptimizeRequest } from '../../../common/constants'

export default async ({ image, options }: IOptimizeRequest) => {
  await sleep(100)

  return Object.assign({}, image, {
    color: options.color,
  })
}
