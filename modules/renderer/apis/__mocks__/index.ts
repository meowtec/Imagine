import { sleep } from '../../../common/utils'
import { IOptimizeRequest } from '../../../common/types'

export const optimize = async ({ image, options }: IOptimizeRequest) => {
  await sleep(100)

  return { ...image, color: options.color }
}
