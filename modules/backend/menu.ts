import { EventEmitter } from 'events'
import { Menu } from 'electron'
import controller from './controller'
import { SaveType } from '../common/constants'
import * as menuActions from './menu-actions'
import { isDev } from './dev'
import __ from '../locales'
import pkg from '../../package.json'

class ManuManager extends EventEmitter {
  taskCount = 0
  aloneMode = false

  handleSave(type: SaveType) {
    this.emit('save', type)
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
            click: menuActions.about,
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
            click: menuActions.open,
          },
          ...saveFragment,
        ],
      },
    ]

    if (isDev) {
      menuTemplates.push({
        label: 'Debug',
        submenu: [
          {role: 'reload'},
          {role: 'forcereload' as 'reload'},
          {role: 'toggledevtools'},

          {role: 'undo'},
          {role: 'redo'},
          {type: 'separator'},
          {role: 'cut'},
          {role: 'copy'},
          {role: 'paste'},
          {role: 'pasteandmatchstyle'},
          {role: 'delete'},
          {role: 'selectall'},
        ],
      })
    }

    const menu = Menu.buildFromTemplate(menuTemplates)

    Menu.setApplicationMenu(menu)
  }
}

export default new ManuManager()
