import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import {
  IpcChannel,
  IUpdateInfo,
} from '../common/constants'
import __ from '../locales'
import controller from './controller'

autoUpdater.logger = log
autoUpdater.autoDownload = false

autoUpdater.on('update-available', (info: IUpdateInfo) => {
  log.info('update available', info.version, info.path)
  controller.ready.then(() => {
    const win = controller.getMainWindow()
    if (win) {
      win.webContents.send(IpcChannel.APP_UPDATE, info)
    }
  })
})

export default autoUpdater
