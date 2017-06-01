import { sleep } from '../../../common/utils'
import { ImageFile, OptimizeOptions, OptimizeRequest } from '../../../common/constants'

export default async ({ image, options }: OptimizeRequest) => {
  await sleep(100)

  return Object.assign({}, image, {
    color: options.color,
  })
}
