import { Menu } from 'electron'
import controller from './controller'
import { SaveType } from '../common/constants'
import * as menuActions from './menu-actions'
import { isDev } from './dev'
import __ from '../locales'
import * as pkg from '../../package.json'

export default function installMenu() {
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
        {
          label: __('save'),
          accelerator: 'CommandOrControl+S',
          click: () => controller.triggerSave(SaveType.OVER),
        },
        {
          label: __('save_new'),
          // accelerator: 'CommandOrControl+S',
          click: () => controller.triggerSave(SaveType.NEW_NAME),
        },
        {
          label: __('save_dir'),
          // accelerator: 'CommandOrControl+S',
          click: () => controller.triggerSave(SaveType.NEW_DIR),
        },
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
      ],
    })
  }

  const menu = Menu.buildFromTemplate(menuTemplates)

  Menu.setApplicationMenu(menu)
}
