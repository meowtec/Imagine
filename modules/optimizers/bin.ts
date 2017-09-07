import log from 'electron-log'
import * as path from 'path'
import * as os from 'os'

const platformAlias: {[key: string]: string} = {
  darwin: 'mac',
  win32: 'win',
}

const platform = os.platform()
const targetDir = platformAlias[platform] || platform

const getBin = (name: string) => {
  if (platform === 'win32') {
    name = name + '.exe'
  }

  return path.resolve(__dirname, '../../../bin', targetDir, name)
}

export const pngquant = getBin('pngquant')
export const mozjpeg = getBin('moz-cjpeg')

log.info('binPath', {
  pngquant,
  mozjpeg,
})
