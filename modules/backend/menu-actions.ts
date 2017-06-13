import { Menu, dialog } from 'electron'
import { EventEmitter } from 'events'
import controller from './controller'
import __ from '../locales'

export const about = () => {
  // TODO
}

export const open = () => {
  dialog.showOpenDialog({
    title: __('choose_images'),
    filters: [{
      name: 'Images',
      extensions: [
        // TODO:
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
