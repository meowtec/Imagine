import { Menu } from 'electron'
import * as menuActions from './menu-actions'

export default function installMenu () {
  const menu = Menu.buildFromTemplate([
    {
      label: 'PQ',
      submenu: [
        {
          label: 'About PQ',
          click: menuActions.about,
        },
        {
          type: 'separator',
        },
        {
          role: 'quit',
        },
      ]
    },

    {
      label: 'File',
      submenu: [
        {
          label: 'Open...',
          accelerator: 'CommandOrControl+O',
          click: menuActions.open,
        },
      ]
    },

    {
      label: 'Debug',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload' as 'reload'},
        {role: 'toggledevtools'},
      ]
    },
  ])

  Menu.setApplicationMenu(menu)
}
