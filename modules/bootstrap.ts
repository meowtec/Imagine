import { app, BrowserWindow } from 'electron'
import { url } from './backend/dev'
import controller from './backend/controller'
import updater from './backend/updater'
import { cleanTmpdir } from './common/file-utils'
import x, { setup as setupLocales } from './locales/'
import log from 'electron-log'

cleanTmpdir()

app.on('ready', () => {
  log.info('app launch')
  setupLocales()
  controller.start()
  updater.checkForUpdates()
})
