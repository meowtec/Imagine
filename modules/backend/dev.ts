/* tslint:disable no-var-requires */

import * as path from 'path'
import { app } from 'electron'

const port = 9999
const { NODE_ENV } = process.env

let url: string

const isDev = NODE_ENV === 'development'

if (!isDev) {
  url = 'file://' + path.resolve(__dirname, '../../htdocs/app.html')
} else {
  // start dev server
  const webpack = require('webpack')
  const WebpackDevServer = require('webpack-dev-server')
  const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, default: installExtension } = require('electron-devtools-installer')
  const config = require('../webpack.config.js')

  const compiler = webpack(config.default(process.env, { mode: 'development' }))
  const server = new WebpackDevServer(compiler, {
    publicPath: '/htdocs',
    hot: true,
  })

  server.listen(port)

  app.on('ready', () => {
    // install extentions
    installExtension(REACT_DEVELOPER_TOOLS)
    installExtension(REDUX_DEVTOOLS)
  })

  url = 'http://localhost:9999/htdocs/app.html'
}

export { isDev, url }
