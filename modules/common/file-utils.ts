import * as os from 'os'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as crypto from 'crypto'
import * as fileType from 'file-type'
import * as readChunk from 'read-chunk'
import * as rawBody from 'raw-body'
import { IImageFile, IOptimizeOptions, SupportedExt } from '../common/constants'

export const tmpdir = path.resolve(os.tmpdir(), 'imageOptimizer')

export const cleanTmpdir = () => fs.emptyDirSync(tmpdir)

const takeSubHash = (hash: string) => hash.replace(/[/+=]/g, '').slice(0, 32)

export function md5(text: string) {
  return crypto.createHash('md5').update(text).digest('hex')
}

export function getSize(path: string) {
  return fs.stat(path).then(stats => stats.size)
}

export async function fileMD5(path: string) {
  const hash: any = crypto.createHash('md5')
  fs.createReadStream(path).pipe(hash)
  return rawBody(hash, {
    encoding: 'hex',
  })
}

export async function imageType(file: string | Buffer) {
  if (typeof file === 'string') {
    file = await readChunk(file, 0, 12)
  }
  return fileType(file)
}

export const getFilePath = (image: IImageFile) => path.resolve(tmpdir, image.id + '.' + image.ext)

export const saveFilesTmp = (files: string[]) => {
  return Promise.all(files.map(async file => {
    const type = await imageType(file)
    if (!(type.ext in SupportedExt)) {
      return
    }

    const id = md5(file) + await fileMD5(file)
    const size = await getSize(file)

    const descriptor: IImageFile = {
      url: null,
      size,
      id,
      ext: type.ext as SupportedExt,
      originalName: file,
    }

    const dest = getFilePath(descriptor)
    descriptor.url = 'file://' + dest

    await fs.copy(file, dest)

    return descriptor
  }))
}

/**
 * get a unoccupied file path by an orignial path.
 * example: `/path/to/a.txt` to `/path/to/a(1).txt`
 * @param filePath - original file path
 */
export const unoccupiedFile = (filePath: string, index = 0): Promise<string> => {
  const accessPath = index
    ? filePath.replace(/(\.\w+)?$/, `(${index})$1`)
    : filePath

  return fs.access(accessPath)
    .then(() => unoccupiedFile(filePath, index + 1))
    .catch(() => accessPath)
}
