import path from 'path'
import webpack, { Configuration, Entry } from 'webpack'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'

const rel = (filename: string) => path.resolve(__dirname, filename)

const IMAGINE_ENV = process.env.IMAGINE_ENV as 'development' | 'production'
const isDev = IMAGINE_ENV === 'development'

const entries: Entry = {
  app: './modules/renderer/Index',
}

const config: Configuration = {
  mode: IMAGINE_ENV,

  entry: entries,

  output: {
    path: rel('../dist/web'),
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
        type: 'asset/inline',
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
        IMAGINE_ENV: JSON.stringify(IMAGINE_ENV),
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
