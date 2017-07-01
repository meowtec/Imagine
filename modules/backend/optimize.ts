import * as path from 'path'
import { IImageFile, IOptimizeOptions, SupportedExt } from '../common/constants'
import * as fu from '../common/file-utils'
import { IOptimizerConstructor } from '../optimizers/base'
import PNGQuant from '../optimizers/pngquant'
import Mozjpeg from '../optimizers/mozjpeg'

const optimize = async (image: IImageFile, options: IOptimizeOptions): Promise<IImageFile> => {
  const isPNG = image.ext === SupportedExt.png
  const isJPEG = image.ext === SupportedExt.jpg

  const sourcePath = fu.getFilePath(image)
  const optimizedId = fu.md5(image.id + JSON.stringify(options))

  const dest: Partial<IImageFile> = {
    id: optimizedId,
    ext: image.ext,
    originalName: image.originalName,
  }

  const destPath = fu.getFilePath(dest)

  dest.url = 'file://' + destPath

  try {
    dest.size = await fu.getSize(destPath)
  } catch (e) {
    let Class: IOptimizerConstructor | null = null

    if (isPNG) {
      Class = PNGQuant
    }

    if (isJPEG) {
      Class = Mozjpeg
    }

    if (!Class) {
      throw new Error(`Unsupported file format: ${image.ext}`)
    }

    const optimizer = new Class(options)

    await optimizer.io(sourcePath, destPath)

    dest.size = await fu.getSize(destPath)
  }

  return dest as IImageFile
}

export default optimize
