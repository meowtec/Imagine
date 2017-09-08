import { Readable } from 'stream'
import { spawn, exec } from 'child-process-promise'
import log from 'electron-log'

/**
 * detect whether ImageMagick installed
 */
export const detectImageMagick = async () => {
  try {
    const { stdout } = await exec('magick -version')

    if (stdout.indexOf('ImageMagick') === -1) {
      log.error('magick detect error, stdout is:', stdout)
      return false
    }

    return true
  } catch (err) {
    log.error('magick detect error', err)
    return false
  }
}

export const convert = (input: string, output: string) =>
  spawn('magick',
    [ input, output ],
    {
      capture: [ 'stdout', 'stderr' ],
    }
  ).catch(e => {
    throw new Error(e.message + '\n' + e.stderr)
  })
