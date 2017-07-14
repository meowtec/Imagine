import * as os from 'os'
import { BrowserWindow, ipcMain, dialog, app, shell } from 'electron'
import * as path from 'path'
import * as fs from 'fs-extra'
import {
  SupportedExt,
  IImageFile,
  IOptimizeOptions,
  IOptimizeRequest,
  IpcChannel,
  SaveType,
  IBackendState,
} from '../common/constants'
import * as fu from '../common/file-utils'
import { url } from './dev'
import PNGQuant from '../optimizers/pngquant'
import { listenIpc } from './ipc-responser'
import optimize from './optimize'
import { saveFiles, saveFile } from './save'
import menuManager from './menu'
import * as menuActions from './menu-actions'
import __ from '../locales'

type BrowserWindow = Electron.BrowserWindow

class Controller {
  private windows: number[] = []
  private menu = menuManager
  private readyHook: () => void

  ready = new Promise((resolve) => {
    this.readyHook = resolve
  })

  start() {
    const shouldQuit = app.makeSingleInstance(this.onOtherInstance)
    if (shouldQuit) {
      app.quit()
      return
    } else {
      this.createWindow()
    }
    this.menu.render()
    this.listenIpc()
    this.listenMenu()

    app.on('window-all-closed', () => {
      app.quit()
    })
  }

  onOtherInstance = () => {
    const win = this.getMainWindow()
    win && win.focus()
  }

  getMainWindow() {
    const id = this.windows[0]
    if (id != null) {
      return BrowserWindow.fromId(id)
    }
  }

  createWindow() {
    const win = new BrowserWindow({
      width: os.platform() === 'darwin' ? 800 : 834,
      height: 600,
      minWidth: 540,
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

  async receiveFiles(filePaths: string[], winId?: string) {
    const files = await fu.flattenFiles(filePaths)
    const dests = (await fu.saveFilesTmp(files)).filter(x => x)
    const win = this.getMainWindow()
    win && win.webContents.send(IpcChannel.FILE_SELECTED, dests)
  }

  listenMenu() {
    this.menu.on('save', (type: SaveType) => {
      const win = this.getMainWindow()
      win && win.webContents.send(IpcChannel.SAVE, type)
    })
  }

  listenIpc() {
    listenIpc<IOptimizeRequest, IImageFile>(IpcChannel.OPTIMIZE, ({image, options}) => {
      return optimize(image, options)
    })

    ipcMain.on(IpcChannel.FILE_SELECT, () => {
      menuActions.open()
    })

    ipcMain.on(IpcChannel.FILE_ADD, (event: any, files: string[]) => {
      this.receiveFiles(files)
    })

    ipcMain.on(IpcChannel.SAVE, (event: Electron.IpcMessageEvent, images: IImageFile[], type: SaveType) => {
      const save = (dirname?: string) =>
        saveFiles(images, type, dirname)
          .then(() => {
            event.sender.send(IpcChannel.SAVED)
          })

      if (type === SaveType.NEW_DIR) {
        dialog.showOpenDialog({
          title: 'Save files',
          properties: ['openDirectory', 'createDirectory'],
        }, filePaths => {
          if (!filePaths || !filePaths.length) return
          const dirpath = filePaths[0]
          save(dirpath).then(() => {
            shell.openItem(dirpath)
          })
        })
      } else if (type === SaveType.SAVE_AS) {
        dialog.showSaveDialog({
          title: 'Save files',
          defaultPath: images[0].originalName,
        }, filePath => {
          saveFile(images[0], filePath)
            .then(() => {
              event.sender.send(IpcChannel.SAVED)
            })
        })
      } else {
        save()
      }
    })

    ipcMain.on(IpcChannel.SYNC, (event: any, state: IBackendState) => {
      const { menu } = this
      menu.taskCount = state.taskCount
      menu.aloneMode = state.aloneMode
      menu.render()
    })

    ipcMain.on(IpcChannel.READY, this.readyHook)
  }
}

export default new Controller()
