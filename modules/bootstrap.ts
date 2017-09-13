import { app, BrowserWindow } from 'electron'
import { url } from './backend/dev'
import controller from './backend/controller'
import updater from './backend/updater'
import { cleanTmpdir } from './common/file-utils'
import { setup as setupLocales } from './locales/'
import log from 'electron-log'

cleanTmpdir()

log.transports.file.level = 'info'

app.on('ready', (launchInfo) => {
  log.info('app launch', process.argv)

  controller.receiveFiles(process.argv.slice(1))

  setupLocales()

  controller.start()

  updater.checkForUpdates()
})

app.on('open-file', (e, filePath) => {
  controller.receiveFiles([filePath])
})
