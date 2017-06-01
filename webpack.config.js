const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')

const rel = filename => path.resolve(__dirname, filename)

const NODE_ENV = process.env.NODE_ENV

const entries = {
  'app': './modules/renderer/Index',
}

let config = {
  entry: entries,
  output: {
    path: rel('htdocs'),
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'react-hot-loader/webpack',
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {
                module: 'es2015',
              },
            },
          }
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
          'file-loader?name=res/[name]-[hash:6].[ext]',
        ],
      },
      {
        test: /\.svg$/,
        use: [
          'svg-sprite-loader?symbolId=icon-[name]',
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
  ],

  resolve: {
    extensions: ['.js', '.ts', '.json', '.tsx'],
    alias: {
    },
  },

  target: 'electron-renderer',

  devServer: {

  },

}

/**
 * 使用 HtmlWebpackPlugin 自动生成入口对应的 html 文件
 */
config = merge(config, {
  plugins: Object.keys(entries)
    .map(entry => new HtmlWebpackPlugin({
      filename: entry + '.html',
      template: 'modules/renderer/template.html',
      inject: true,
    })
  )
})

/**
 * 开发环境和生产环境的 config 差异部分：
 *  - 开发环境使用 style-loader 由 js 注入 css，实现样式热更新
 *  - 生产环境使用 ExtractTextPlugin 抽离单独 css 文件，更快
 */
const envConfigs = {
  // 生产环境
  production: {
    plugins: [
      new BabiliPlugin(),
    ],

    resolve: {
      alias: {
        'react': 'react/dist/react.min.js',
        'react-dom': 'react-dom/dist/react-dom.min.js',
      },
    },

    externals: {
      'react-hot-loader': '{}',
    },
  },

  // 开发环境
  development: {
    plugins: [
      new webpack.NamedModulesPlugin(),
    ],

    resolve: {
      alias: {
        'react': 'react/dist/react.js',
        'react-dom': 'react-dom/dist/react-dom.js',
      },
    },
  }
}

module.exports = merge(
  config,
  NODE_ENV === 'production'
    ? envConfigs.production
    : envConfigs.development
)
