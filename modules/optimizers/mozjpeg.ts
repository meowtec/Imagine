import * as fs from 'fs'
import * as path from 'path'
import { Readable, Duplex } from 'stream'
import { spawn } from 'child-process-promise'
import { mozjpeg } from './bin'
import * as rawBody from 'raw-body'
import log from 'electron-log'

import Optimizer from './base'

export default class PNGQuant extends Optimizer {
  io(input: string, output: string) {
    const { quality = 70 } = this.options

    return spawn(mozjpeg, [
      '-quality',
      quality.toString(),
      '-outfile',
      output,
      input,
    ], {
      capture: [ 'stdout', 'stderr' ],
    }).catch(e => {
      throw new Error(e.message + '\n' + e.stderr)
    })
  }
}
