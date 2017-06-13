import { Menu } from 'electron'
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
