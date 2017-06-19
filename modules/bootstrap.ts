import { app, BrowserWindow } from 'electron'
import { url } from './backend/dev'
import controller from './backend/controller'
import { cleanTmpdir } from './common/file-utils'
import x, { setup as setupLocales } from './locales/'

cleanTmpdir()

app.on('ready', () => {
  setupLocales()
  controller.start()
})
