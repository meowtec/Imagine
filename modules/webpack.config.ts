import path from 'path'
import webpack, { Configuration, Entry } from 'webpack'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const rel = (filename: string) => path.resolve(__dirname, filename)

const NODE_ENV = process.env.NODE_ENV as 'development' | 'production'
const isDev = NODE_ENV === 'development'

const addHotEntry = (entry: string | string[]) => {
  if (isDev) {
    return [
      'webpack-dev-server/client?http://localhost:9999/',
      'webpack/hot/only-dev-server',
    ].concat(entry)
  }
  return entry
}

const entries: Entry = {
  app: addHotEntry('./modules/renderer/Index'),
}

const config: Configuration = {
  mode: NODE_ENV,

  entry: entries,

  output: {
    path: rel('../dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                // ... other plugins
                isDev && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
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
        type: 'asset/resource',
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
    new ReactRefreshWebpackPlugin(),
  ],

  resolve: {
    extensions: ['.js', '.ts', '.json', '.tsx'],
    alias: {},
  },

  target: 'electron-renderer',

  devServer: {

  },
}

export default config
