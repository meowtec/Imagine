import * as path from 'path'
import * as os from 'os'
import Electron, {
  BrowserWindow, ipcMain, dialog, app, shell,
} from 'electron'
import { log } from 'electron-log'
import {
  IImageFile,
  IOptimizeRequest,
  IpcChannel,
  SaveType,
  IBackendState,
} from '../common/types'
import * as fu from '../common/file-utils'
import { listenAsyncCall } from '../bridge/async-call/main'
import optimize from './optimize'
import { saveFiles, saveFile } from './save'
import Menu from './menu'

class App {
  private windows: number[] = []

  private menu = new Menu()

  ready = new Promise((resolve) => {
    ipcMain.once(IpcChannel.READY, resolve)
  })

  start(url: string) {
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      app.quit()
    } else {
      app.on('window-all-closed', () => {
        app.quit()
      })

      app.on('second-instance', this.onOtherInstance)

      this.createWindow(url)
      this.menu.render()
      this.listenIpc()
      this.listenMenu()
    }
  }

  onOtherInstance = (event: Electron.Event, argv: string[]) => {
    const win = this.getMainWindow()
    win?.focus()

    this.receiveFiles(argv.slice(1))
  }

  getMainWindow() {
    const id = this.windows[0]
    if (id != null) {
      return BrowserWindow.fromId(id)
    }

    return null
  }

  createWindow(url: string) {
    const baseWidth = 800

    const win = new BrowserWindow({
      width: baseWidth + (os.platform() === 'darwin' ? 15 : 34),
      height: 600,
      minWidth: 540,
      // titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        preload: path.resolve(__dirname, '../bridge/preload'),
        // contextIsolation: false,
      },
    })

    const { id } = win

    log(url)
    win.loadURL(url).then(() => {
      log('url loaded:', url)
    }, (err) => {
      log('url failed:', url, err)
    })

    win.on('closed', () => {
      const index = this.windows.indexOf(id)
      if (index > -1) {
        this.windows.splice(index, 1)
      }
    })

    win.webContents.on('will-navigate', (e) => {
      e.preventDefault()
    })

    if (process.env.NODE_ENV === 'development') {
      win.webContents.openDevTools()
    }

    this.windows.push(id)
  }

  async receiveFiles(filePaths: string[]) {
    const files = await fu.flattenFiles(filePaths)
    const dests = (await fu.saveFilesTmp(files)).filter((x) => x)

    await this.ready

    const win = this.getMainWindow()
    win?.webContents.send(IpcChannel.FILE_SELECTED, dests)
  }

  listenMenu() {
    this.menu.on('save', (type: SaveType) => {
      const win = this.getMainWindow()
      win?.webContents.send(IpcChannel.SAVE, type)
    })

    this.menu.on('open-files', (files: string[]) => this.receiveFiles(files))
  }

  handleIpcFileSave = async (event: Electron.IpcMainEvent, { images, type }: { images: IImageFile[], type: SaveType }) => {
    const saveToDir = async (dirname?: string) => {
      await saveFiles(images, type, dirname)
      event.sender.send(IpcChannel.SAVED)
    }

    const mainWindow = this.getMainWindow()
    if (!mainWindow) return

    if (type === SaveType.NEW_DIR) {
      const { filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Save files',
        properties: ['openDirectory', 'createDirectory'],
      })

      if (!filePaths || !filePaths.length) return
      const dirpath = filePaths[0]
      await saveToDir(dirpath)
      shell.openPath(dirpath)
    } else if (type === SaveType.SAVE_AS) {
      const image = images[0]

      const { filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Save files',
        defaultPath: fu.reext(image.originalName, image.ext),
        filters: [{
          name: 'Images',
          extensions: [image.ext],
        }],
      })

      if (filePath) {
        await saveFile(images[0], filePath)
        event.sender.send(IpcChannel.SAVED)
      }
    } else {
      saveToDir()
    }
  }

  listenIpc() {
    listenAsyncCall<IOptimizeRequest, IImageFile>(IpcChannel.OPTIMIZE, ({ image, options }) => optimize(image, options))

    ipcMain.on(IpcChannel.FILE_SELECT, () => {
      this.menu.open()
    })

    ipcMain.on(IpcChannel.FILE_ADD, (event, files: string[]) => {
      this.receiveFiles(files)
    })

    ipcMain.on(IpcChannel.SAVE, this.handleIpcFileSave)

    ipcMain.on(IpcChannel.SYNC, (event, state: IBackendState) => {
      const { menu } = this
      menu.taskCount = state.taskCount
      menu.aloneMode = state.aloneMode
      menu.render()
    })
  }
}

export default new App()
