import { Menu, dialog, shell } from 'electron'
import { EventEmitter } from 'events'
import controller from './controller'
import __ from '../locales'
import * as pkg from '../../package.json'

export const about = () => {
  dialog.showMessageBox({
    type: 'info',
    title: __('about', pkg.name),
    message: `Imagine v${pkg.version}`,
    detail: `Created by Meowtec\n${pkg.homepage}`,
    buttons: [__('ok'), __('visit')],
  }, response => {
    if (response === 1) {
      shell.openExternal(pkg.homepage)
    }
  })
}

export const open = () => {
  dialog.showOpenDialog({
    title: __('choose_images'),
    filters: [{
      name: 'Images',
      extensions: [
        'jpg',
        'png',
      ],
    }],
    properties: [
      'openFile',
      'multiSelections',
    ],
  }, filePaths => {
    controller.receiveFiles(filePaths)
  })
}
