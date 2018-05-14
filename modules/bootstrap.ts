import { app, BrowserWindow } from 'electron'
import { url } from './backend/dev'
import imagine from './backend/app'
import updater from './backend/updater'
import { cleanTmpdir } from './common/file-utils'
import { setup as setupLocales } from './locales/'
import log from 'electron-log'

cleanTmpdir()

log.transports.file.level = 'info'

app.on('ready', (launchInfo) => {
  log.info('app launch', process.argv)

  imagine.receiveFiles(process.argv.slice(1))

  setupLocales()

  imagine.start()

  updater.checkForUpdates()
})

app.on('open-file', (e, filePath) => {
  imagine.receiveFiles([filePath])
})
