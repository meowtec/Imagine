import { Menu, dialog } from 'electron'
import { EventEmitter } from 'events'
import controller from './controller'

export const about = () => {
  // TODO
}

export const open = () => {
  dialog.showOpenDialog({
    title: 'Choose image file',
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
