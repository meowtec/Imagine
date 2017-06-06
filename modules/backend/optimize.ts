import * as path from 'path'
import { ImageFile, OptimizeOptions, SupportedExt } from '../common/constants'
import * as fu from '../common/file-utils'
import { OptimizerConstructor } from '../optimizers/base'
import PNGQuant from '../optimizers/pngquant'
import Mozjpeg from '../optimizers/mozjpeg'

const optimize = async (image: ImageFile, options: OptimizeOptions): Promise<ImageFile> => {
  const isPNG = image.ext === SupportedExt.png
  const isJPEG = image.ext === SupportedExt.jpg

  const sourcePath = fu.getFilePath(image)
  const destPath = fu.getFilePath(image, options)

  const dest: ImageFile = {
    id: image.id,
    ext: image.ext,
    url: 'file://' + destPath,
    size: null,
    originalName: image.originalName,
  }

  try {
    dest.size = await fu.getSize(destPath)
  } catch (e) {
    let Class: OptimizerConstructor

    if (isPNG) {
      Class = PNGQuant
    }

    if (isJPEG) {
      Class = Mozjpeg
    }

    const optimizer = new Class(options)

    await optimizer.io(sourcePath, destPath)

    dest.size = await fu.getSize(destPath)
  }

  return dest
}

export default optimize
