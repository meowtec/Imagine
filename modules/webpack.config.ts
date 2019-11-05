import path from 'path'
import webpack, { Configuration, Entry } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin'

const rel = (filename: string) => path.resolve(__dirname, filename)

const NODE_ENV = process.env.NODE_ENV

export default (env: any, argv: any) => {
  const isDev = argv.mode === 'development'

  const addHotEntry = (entry: string | string[]) => {
    if (isDev) {
      return [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://localhost:9999/`,
        'webpack/hot/only-dev-server',
      ].concat(entry)
    } else {
      return entry
    }
  }

  const entries: Entry = {
    app: addHotEntry('./modules/renderer/Index'),
  }

  const config: Configuration = {
    mode: argv.mode,
    entry: entries,
    output: {
      path: rel('../htdocs'),
      filename: '[name].js',
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
            },
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  module: 'es2015',
                },
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            'less-loader',
          ],
        },
        {
          test: /\.(png|jpg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'res/[name]-[hash:6].[ext]',
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-sprite-loader',
              options: {
                symbolId: 'icon-[name]',
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(NODE_ENV),
        },
      }),
      new SpriteLoaderPlugin(),
      ...Object.keys(entries)
        .map(entry => new HtmlWebpackPlugin({
          filename: entry + '.html',
          template: 'modules/renderer/template.html',
        })
      ),
    ],

    resolve: {
      extensions: ['.js', '.ts', '.json', '.tsx'],
      alias: {},
    },

    target: 'electron-renderer',

    devServer: {

    },
  }

  return config
}
