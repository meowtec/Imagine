import * as path from 'path'
import { app } from 'electron'
import log from 'electron-log'
import imagine from './backend/app'
import updater from './backend/updater'
import { IS_DEV } from './common/env'
import { cleanTmpdir } from './common/file-utils'
import { setup as setupLocales } from './locales'

cleanTmpdir()

log.transports.file.level = 'info'

app.on('ready', () => {
  log.info('app launch', process.argv)

  imagine.receiveFiles(process.argv.slice(1))

  setupLocales(app.getLocale())

  if (IS_DEV) {
    // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
    require('./dev/dev').start().then(() => {
      imagine.start('http://localhost:9999/')
    })
  } else {
    imagine.start(`file://${path.resolve(app.getAppPath(), 'dist/web/index.html')}`)
    updater.checkForUpdates()
  }
})

app.on('open-file', (e, filePath) => {
  imagine.receiveFiles([filePath])
})
