import { Menu } from 'electron'
import controller from './controller'
import { SaveType } from '../common/constants'
import * as menuActions from './menu-actions'
import __ from '../locales'

export default function installMenu() {
  const menu = Menu.buildFromTemplate([
    {
      label: 'Imagine',
      submenu: [
        {
          label: __('about', 'Imagine'),
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

    {
      label: 'Debug',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload' as 'reload'},
        {role: 'toggledevtools'},
      ],
    },
  ])

  Menu.setApplicationMenu(menu)
}
