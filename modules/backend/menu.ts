import * as os from 'os'
import { EventEmitter } from 'events'
import { dialog, Menu, shell } from 'electron'
import { SaveType } from '../common/types'
import { IS_DEV } from '../common/env'
import __ from '../locales'
import pkg from '../../package.json'

interface MenuEventMap {
  save: SaveType;
  'open-files': string[];
}

declare interface AppMenu {
  on<K extends keyof MenuEventMap>(type: K, listener: (ev: MenuEventMap[K]) => void): this;
  emit<K extends keyof MenuEventMap>(type: K, data: MenuEventMap[K]): boolean;
}

class AppMenu extends EventEmitter {
  taskCount = 0

  aloneMode = false

  handleSave(type: SaveType) {
    this.emit('save', type)
  }

  async about() {
    const { response } = await dialog.showMessageBox({
      type: 'info',
      title: __('about', pkg.name),
      message: `Imagine v${pkg.version}`,
      detail: `Created by Meowtec\n${pkg.homepage}`,
      buttons: [__('ok'), __('visit')],
    })

    if (response === 1) {
      shell.openExternal(pkg.homepage)
    }
  }

  async open() {
    const properties: Electron.OpenDialogOptions['properties'] = [
      'openFile',
      'multiSelections',
    ]

    if (os.platform() === 'darwin') {
      properties.push('openDirectory')
    }

    const { filePaths } = await dialog.showOpenDialog({
      title: __('choose_images'),
      filters: [{
        name: 'Images',
        extensions: [
          'jpg',
          'jpeg',
          'png',
        ],
      }],
      properties,
    })

    this.emit('open-files', filePaths)
  }

  render() {
    let saveFragment: Electron.MenuItemConstructorOptions[] = []

    if (this.taskCount) {
      saveFragment = this.aloneMode ? (
        [{
          label: __('save'),
          accelerator: 'CommandOrControl+S',
          click: () => this.handleSave(SaveType.OVER),
        },
        {
          label: __('save_as'),
          click: () => this.handleSave(SaveType.SAVE_AS),
        }]
      ) : (
        [{
          label: __('save'),
          accelerator: 'CommandOrControl+S',
          click: () => this.handleSave(SaveType.OVER),
        },
        {
          label: __('save_new'),
          click: () => this.handleSave(SaveType.NEW_NAME),
        },
        {
          label: __('save_dir'),
          click: () => this.handleSave(SaveType.NEW_DIR),
        }]
      )
    }

    const menuTemplates: Electron.MenuItemConstructorOptions[] = [
      {
        label: pkg.name,
        submenu: [
          {
            label: __('about', pkg.name),
            click: this.about,
          },
          {
            type: 'separator',
          },
          {
            role: 'quit',
          },
        ],
      },

      {
        label: __('file'),
        submenu: [
          {
            label: __('open'),
            accelerator: 'CommandOrControl+O',
            click: this.open,
          },
          ...saveFragment,
        ],
      },
    ]

    if (IS_DEV) {
      menuTemplates.push({
        label: 'Debug',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
        ],
      })
    }

    const menu = Menu.buildFromTemplate(menuTemplates)

    Menu.setApplicationMenu(menu)
  }
}

export default AppMenu
