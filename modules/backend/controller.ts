import { BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as fs from 'fs-extra'
import { SupportedExt, IImageFile, IOptimizeOptions, IOptimizeRequest, IpcChannel } from '../common/constants'
import * as fu from '../common/file-utils'
import { url } from './dev'
import PNGQuant from '../optimizers/pngquant'
import { listenIpc } from './ipc-responser'
import optimize from './optimize'
import * as menuActions from './menu-actions'

type BrowserWindow = Electron.BrowserWindow

class Controller {
  windows: number[] = []

  constructor() {
    this.listenIpc()
  }

  createWindow() {
    const win = new BrowserWindow({
      width: 900,
      height: 600,
      // titleBarStyle: 'hidden',
      webPreferences: {
        webSecurity: false,
      },
    })

    const { id } = win

    win.loadURL(url)

    win.on('closed', () => {
      const index = this.windows.indexOf(id)
      if (index > -1) {
        this.windows.splice(index, 1)
      }
    })

    win.webContents.on('will-navigate', e => {
      e.preventDefault()
    })

    if (process.env.NODE_ENV === 'development') {
      win.webContents.openDevTools()
    }

    this.windows.push(id)
  }

  async receiveFiles(files: string[], winId?: string) {
    const dests = (await fu.saveFilesTmp(files)).filter(x => x)
    const win = BrowserWindow.fromId(this.windows[0])
    win.webContents.send(IpcChannel.FILE_SELECTED, dests)
  }

  listenIpc() {
    listenIpc<IOptimizeRequest, IImageFile>(IpcChannel.OPTIMIZE, ({image, options}) => {
      return optimize(image, options)
    })

    ipcMain.on(IpcChannel.FILE_SELECT, () => {
      menuActions.open()
    })

    ipcMain.on(IpcChannel.FILE_ADD, (event, files: string[]) => {
      this.receiveFiles(files)
    })
  }
}

export default new Controller()
