import * as path from 'path'
import { ImageFile, OptimizeOptions, SupportedExt } from '../common/constants'
import * as fu from '../common/file-utils'
import PNGQuant from '../optimizers/pngquant'

const optimize = async (image: ImageFile, options: OptimizeOptions): Promise<ImageFile> => {
  const isPNG = image.ext === SupportedExt.png
  const isJPEG = image.ext === SupportedExt.jpg

  const sourcePath = fu.getFilePath(image)
  const destPath = fu.getFilePath(image, options)

  const dest: ImageFile = {
    id: image.id,
    ext: image.ext,
    url: 'file://' + destPath,
    color: options.color,
    size: null,
    originalName: image.originalName,
  }

  try {
    dest.size = await fu.getSize(destPath)
  } catch (e) {
    if (isPNG) {
      const optimizer = new PNGQuant(options)
      await optimizer.io(sourcePath, destPath)
    }

    if (isJPEG) {
      // TODO
    }

    dest.size = await fu.getSize(destPath)
  }

  return dest
}

export default optimize
