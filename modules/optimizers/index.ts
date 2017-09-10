import { spawn } from 'child-process-promise'
import log from 'electron-log'
import * as bins from './bin'
import { IOptimizeOptions } from '../common/constants'

export type IOptimizeMethod = (
  input: string,
  output: string,
  options: IOptimizeOptions,
) => Promise<any>

export const mozjpeg: IOptimizeMethod = (
  input: string,
  output: string,
  options: IOptimizeOptions
) => {
  const { quality = 70 } = options

  const spawnArgs = [
    '-quality',
    quality.toString(),
    '-outfile',
    output,
    input,
  ]

  log.info('spawn', bins.mozjpeg, spawnArgs)

  return spawn(bins.mozjpeg, spawnArgs, {
    capture: [ 'stdout', 'stderr' ],
  }).catch(e => {
    throw new Error(e.message + '\n' + e.stderr)
  })
}

export const pngquant: IOptimizeMethod = (
  input: string,
  output: string,
  options: IOptimizeOptions
) => {
  const { color = 256 } = options

  const spawnArgs = [
    color.toString(),
    input,
    '-o',
    output,
  ]

  log.info('spawn', bins.pngquant, spawnArgs)

  return spawn(bins.pngquant, spawnArgs, {
    capture: [ 'stdout', 'stderr' ],
  }).catch(e => {
    throw new Error(e.message + '\n' + e.stderr)
  })
}

export const cwebp: IOptimizeMethod = (
  input: string,
  output: string,
  options: IOptimizeOptions
) => {
  const { quality = 80 } = options

  const spawnArgs = [
    '-q',
    quality.toString(),
    input,
    '-o',
    output,
  ]

  log.info('spawn', bins.cwebp, spawnArgs)

  return spawn(bins.cwebp, spawnArgs, {
    capture: [ 'stdout', 'stderr' ],
  }).catch(e => {
    throw new Error(e.message + '\n' + e.stderr)
  })
}
