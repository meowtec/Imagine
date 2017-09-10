import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs-extra'
import log from 'electron-log'
import { IImageFile, IOptimizeOptions, SupportedExt } from '../common/constants'
import * as fu from '../common/file-utils'
import { pngquant, mozjpeg, cwebp, IOptimizeMethod } from '../optimizers/'
import { convert } from './imagemagick'

const platform = os.platform()

const optimize = async (image: IImageFile, options: IOptimizeOptions): Promise<IImageFile> => {
  const { exportExt = image.ext } = options

  let sourcePath = fu.getFilePath(image)
  const optimizedId = fu.md5(image.id + JSON.stringify(options))

  const dest: Partial<IImageFile> = {
    id: optimizedId,
    ext: image.ext,
    originalName: image.originalName,
  }

  const destPath = fu.getFilePath(dest)

  log.info('optimize', `convert [${image.ext}]${sourcePath} to [${exportExt}]${destPath}`)

  dest.url = 'file://' + destPath

  try {
    dest.size = await fu.getSize(destPath)
  } catch (err) {
    log.info('optimize', `miss target: ${destPath}, will execute optimization.`, )

    /**
     * pngquant on linux / windows does not support JPEG to PNG.
     * in this case, we should use ImageMagick converting JPEG to PNG firstly.
     */
    if (platform !== 'darwin' && image.ext === 'jpg' && exportExt === 'png') {
      log.info(
        'optimize',
        'pngquant cannot read JPEG on Windows, will have an intermediate step that convert JPEG to PNG'
      )

      const intermediate = sourcePath.replace(/\.jpg$/, '.1.jpg')

      try {
        await fs.access(intermediate)
      } catch (err) {
        log.info('optimize', `never intermediate: ${intermediate}, will do via ImageMagick.`, )
        await convert(sourcePath, intermediate)
        sourcePath = intermediate
      }
    }

    const factory: {[ext: string]: IOptimizeMethod} = {
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
