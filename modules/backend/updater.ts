import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import {
  IpcChannel,
} from '../common/types'
import app from './app'

autoUpdater.logger = log
autoUpdater.autoDownload = false

autoUpdater.on('update-available', async (info) => {
  log.info('update available', info.version, info.files)

  await app.ready

  const win = app.getMainWindow()
  win?.webContents.send(IpcChannel.APP_UPDATE, info)
})

export default autoUpdater
