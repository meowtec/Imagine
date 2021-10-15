import log from 'electron-log'
import * as path from 'path'
import * as os from 'os'

const platform = os.platform()
const arch = os.arch()

export const basePath = path.resolve(
  __dirname.replace('app.asar', 'app.asar.unpacked'),
  '../../bin',
  platform,
  // arm64 is limit supported only for macOS
  platform === 'darwin' && arch === 'arm64'
    ? 'arm64'
    : 'x64',
)

const getBin = (name: string) => path.resolve(
  basePath,
  platform === 'win32' ? `${name}.exe` : name,
)

export const pngquant = getBin('pngquant')
export const mozjpeg = getBin('moz-cjpeg')
export const cwebp = getBin('cwebp')

log.info('binPath', {
  pngquant,
  mozjpeg,
  cwebp,
})
