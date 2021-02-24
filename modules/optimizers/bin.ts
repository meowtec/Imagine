import log from 'electron-log'
import * as path from 'path'
import * as os from 'os'

const platformAlias: { [key: string]: string } = {
  darwin: 'mac',
  win32: 'win',
}

const platform = os.platform()
const targetDir = platformAlias[platform] || platform

export const basePath = path.resolve(
  __dirname,
  '../../bin',
  targetDir,
).replace('app.asar', 'app.asar.unpacked')

const getBin = (name: string) => {
  if (platform === 'win32') {
    name += '.exe'
  }

  return path.resolve(
    basePath,
    name,
  )
}

export const pngquant = getBin('pngquant')
export const mozjpeg = getBin('moz-cjpeg')
export const cwebp = getBin('cwebp')

log.info('binPath', {
  pngquant,
  mozjpeg,
  cwebp,
})
