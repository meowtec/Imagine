import * as os from 'os'
import { Menu, dialog, shell } from 'electron'
import { EventEmitter } from 'events'
import app from './app'
import __ from '../locales'
import pkg from '../../package.json'

export const about = async () => {
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

export const open = async () => {
  const properties = [
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
        'png',
      ],
    }],
    properties: properties as any,
  })

  app.receiveFiles(filePaths)
}
