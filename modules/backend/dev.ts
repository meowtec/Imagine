import { app } from 'electron'
import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'
import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'
import config from '../webpack.config'

const port = 9999

const compiler = webpack(config)
const server = new WebpackDevServer(compiler, {
  publicPath: '/htdocs',
  hot: true,
  port,
  sockPort: port,
})

server.listen(port)

app.on('ready', () => {
  // install extentions
  installExtension(REACT_DEVELOPER_TOOLS)
  installExtension(REDUX_DEVTOOLS)
})
