import * as os from 'os'
import * as fs from 'fs-extra'
import * as path from 'path'
import * as crypto from 'crypto'
import * as fileType from 'file-type'
import * as readChunk from 'read-chunk'
import * as rawBody from 'raw-body'
import { IImageFile, IOptimizeOptions, SupportedExt } from '../common/constants'
import log from 'electron-log'

export const tmpdir = path.resolve(os.tmpdir(), 'imageOptimizer')

export const isSupportedExt = (type: string): type is SupportedExt => {
  return type in SupportedExt
}

export const cleanTmpdir = () => fs.emptyDirSync(tmpdir)

const takeSubHash = (hash: string) => hash.replace(/[/+=]/g, '').slice(0, 32)

export function md5(text: string) {
  return crypto.createHash('md5').update(text).digest('hex')
}

export function getSize(filePath: string) {
  return fs.stat(filePath).then(stats => stats.size)
}

export async function fileMD5(filePath: string) {
  const hash: any = crypto.createHash('md5')
  fs.createReadStream(filePath).pipe(hash)
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

export const getFilePath = (image: Partial<IImageFile>) => path.resolve(tmpdir, image.id + '.' + image.ext)

export const saveFilesTmp = (files: string[]) => {
  return Promise.all(files.map(async file => {
    const type = await imageType(file)
    const ext = type && type.ext

    if (!isSupportedExt(ext)) return

    const id = md5(file) + await fileMD5(file)
    const size = await getSize(file)

    const descriptor: Partial<IImageFile> = {
      size,
      id,
      ext,
      originalName: file,
    }

    const dest = getFilePath(descriptor)
    descriptor.url = 'file://' + dest

    await fs.copy(file, dest)

    return descriptor as IImageFile
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

/**
 * walk dir/file list to a flat files list
 */
export const flattenFiles = async (filePaths: string[]) => {
  let list: string[] = []

  for (const filePath of filePaths) {
    try {
      const stat = await fs.stat(filePath)
      if (stat.isFile()) {
        list.push(filePath)
      } else if (stat.isDirectory()) {
        const dirFileNames = await fs.readdir(filePath)
        const dirFiles = dirFileNames.map(name => path.resolve(filePath, name))
        const dirFlatFiles = await flattenFiles(dirFiles)
        list = list.concat(dirFlatFiles)
      }

    } catch (e) {
      log.error(`Failed to access file ${filePath}`)
    }
  }

  return list
}
