import * as path from 'path'
import { SupportedExt } from './constants'
import { tmpdir } from './file-utils'

type ImageFileBase = {
  id: string
  ext: SupportedExt
}

export default class ImageFile {
  private _base: ImageFileBase
  private _size: number

  constructor (base: ImageFileBase) {
    this._base = base
  }

  get url () {
    return 'file://' + this.path
  }

  get path () {
    return path.resolve(tmpdir, this._base.id + '.' + this._base.ext)
  }

  get size () {
    return this._size
  }

  syncSize () {

  }
}
