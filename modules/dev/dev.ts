import * as path from 'path'
import { app } from 'electron'
import { createServer } from 'vite'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'

app.on('ready', () => {
  // install extentions
  installExtension(REACT_DEVELOPER_TOOLS)
  installExtension(REDUX_DEVTOOLS)
})

export async function start() {
  const server = await createServer({
    configFile: path.resolve(__dirname, '../../vite.config.js'),
  })

  await server.listen()
}
