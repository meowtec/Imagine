import * as path from 'path'
import * as fs from 'fs-extra'
import * as fu from '../common/file-utils'
import { SaveType, ITaskItem } from '../common/constants'

export default async function saveFiles(tasks: ITaskItem[], type: SaveType, dirname?: string) {
  if (type === SaveType.NEW_DIR && !dirname) return

  for (const task of tasks) {
    const { image, optimized } = task
    if (!optimized) continue

    let savePath: string = image.originalName
    if (!savePath.endsWith(optimized.ext)) {
      savePath = savePath + '.' + optimized.ext
    }

    switch (type) {
      case SaveType.OVER:
        break

      case SaveType.NEW_NAME:
        savePath = await fu.unoccupiedFile(savePath)
        break

      case SaveType.NEW_DIR:
        savePath = await fu.unoccupiedFile(path.resolve(dirname, path.basename(savePath)))
        break
    }

    await fs.copy(fu.getFilePath(optimized), savePath)
  }
}
