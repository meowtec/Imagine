import * as fs from 'fs'
import * as path from 'path'
import { Readable, Duplex } from 'stream'
import { spawn } from 'child-process-promise'
import { pngquant } from './bin'
import * as rawBody from 'raw-body'
import log from 'electron-log'

import Optimizer from './base'

export default class PNGQuant extends Optimizer {
  io(input: string, output: string) {
    const { color = 256 } = this.options

    return spawn(pngquant, [
      color.toString(),
      input,
      '-o',
      output,
    ], {
      capture: [ 'stdout', 'stderr' ],
    }).catch(e => {
      throw new Error(e.message + '\n' + (e.stderr || ''))
    })
  }
}
