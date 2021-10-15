import * as os from 'os'
import * as fs from 'fs-extra'
import log from 'electron-log'
import { IImageFile, IOptimizeOptions, SupportedExt } from '../common/types'
import * as fu from '../common/file-utils'
import {
  pngquant, mozjpeg, cwebp, IOptimizeMethod,
} from '../optimizers'
import { getFileUrl } from '../common/file-utils'
import convert from './convert'

const platform = os.platform()

const optimize = async (
  image: IImageFile,
  options: IOptimizeOptions,
): Promise<IImageFile> => {
  let sourcePath = fu.getFilePath(image)
  const optimizedId = fu.md5(image.id + JSON.stringify(options))
  const exportExt = options.exportExt || image.ext

  const dest: Partial<IImageFile> = {
    id: optimizedId,
    ext: exportExt,
    originalName: image.originalName,
  }

  const destPath = fu.getFilePath(dest)

  log.info('optimize', `convert [${image.ext}]${sourcePath} to [${exportExt}]${destPath}`)

  dest.url = getFileUrl(destPath)

  try {
    dest.size = await fu.getSize(destPath)
  } catch (err) {
    log.info('optimize', 'miss cache (desk)')

    /**
     * pngquant on linux / windows does not support JPEG to PNG.
     * in this case, we should use JIMP converting JPEG to PNG firstly.
     */
    if (platform !== 'darwin' && image.ext === 'jpg' && exportExt === 'png') {
      log.info(
        'optimize',
        'should use JIMP for converting JPEG to PNG',
      )

      const intermediate = sourcePath.replace(/\.jpg$/, '.1.png')

      try {
        await fs.access(intermediate)
      } catch (err) {
        log.info('optimize', 'miss cache (JIMP)')
        await convert(sourcePath, intermediate)
      }

      sourcePath = intermediate
    }

    const factory: { [ext: string]: IOptimizeMethod } = {
      [SupportedExt.png]: pngquant,
      [SupportedExt.jpg]: mozjpeg,
      [SupportedExt.webp]: cwebp,
    }

    const optimizeMethod = factory[exportExt]

    if (!optimizeMethod) {
      throw new Error(`Unsupported file format: ${image.ext}`)
    }

    await optimizeMethod(sourcePath, destPath, options)

    dest.size = await fu.getSize(destPath)
  }

  return dest as IImageFile
}

export default optimize
