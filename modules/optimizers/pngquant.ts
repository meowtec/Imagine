import * as fs from 'fs'
import * as path from 'path'
import { Readable, Duplex } from 'stream'
import { spawn } from 'child-process-promise'
import * as pngquantBin from 'pngquant-bin'
import * as rawBody from 'raw-body'
import log from 'electron-log'

import { Optimizer } from './base'

export default class PNGQuant extends Optimizer {
  io (input: string, output: string) {
    const { color = 256 } = this.options

    const pngquantBinFixed = pngquantBin.replace('app.asar', 'app.asar.unpacked')

    return spawn(pngquantBinFixed, [
      color.toString(),
      input,
      '-o',
      output,
    ], {
      capture: [ 'stdout', 'stderr' ]
    }).catch(e => {
      throw new Error(e.message + '\n' + e.stderr)
    })
  }
}
