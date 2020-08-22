const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dvaHMR = require('babel-plugin-dva-hmr');
const webpack = require('webpack');

const pkg = require('./package.json');

const ROOT_DIR = path.resolve(__dirname, '..');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);
const SRC_DIR = resolvePath('src');
const DIST_DIR = resolvePath('dist');
const PUBIC_DIR = resolvePath('public');

const reScript = /\.(js|jsx|mjs)$/;
const reStyle = /\.(css|less|styl|scss|sass|sss)$/;
const reImage = /\.(bmp|gif|jpg|jpeg|png|svg)$/;
const staticAssetName = '[hash:8].[ext]';

const copyPlugin = new CopyWebpackPlugin({
  patterns: [
    {
      from: PUBIC_DIR,
      globOptions: {
        ignore: ['*.html'],
      },
    },
  ],
});

const config = (isDebug) => ({
  context: ROOT_DIR,
  target: 'web',
  entry: {
    app: ['@babel/polyfill', './src/app.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: resolvePath('./public/index.html'),
    }),
    ...(isDebug ? [new webpack.HotModuleReplacementPlugin()] : [copyPlugin]),
  ],
  output: {
    filename: isDebug ? '[name].js' : '[name].[hash:8].js',
    chunkFilename: isDebug ? '[name].chunk.js' : '[name].[hash:8].chunk.js',
    path: DIST_DIR,
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: reScript,
        loader: 'babel-loader',
        options: {
          cacheDirectory: isDebug,
          babelrc: false,
          configFile: false,
          presets: [
            [
              '@babel/preset-env',
              {
                targets: pkg.browserslist,
                modules: false,
                useBuiltIns: false,
                debug: false,
              },
            ],
            ['@babel/preset-react', { development: isDebug }],
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import',
            [
              'import',
              {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: false, // true for less, 'css' for css
              },
              'antd', //配置了第三参数name才能同时启用antd和lodash
            ],
            [
              'import',
              {
                libraryName: 'lodash',
                libraryDirectory: '',
                camel2DashComponentName: false,
              },
              'lodash',
            ],
            // further config required
            /*[
              'react-intl',
              {
                messagesDir: '../dist/messages/',
              },
            ],*/
            ...(isDebug ? [dvaHMR] : []),
          ],
        },
      },
      {
        test: reStyle,
        rules: [
          //先拿style-loader凑合
          {
            loader: 'style-loader',
          },
          // Process external/third-party styles
          {
            exclude: SRC_DIR,
            loader: 'css-loader',
            options: {
              sourceMap: isDebug,
            },
          },
          // Process internal/project styles (from src folder)
          {
            include: SRC_DIR,
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              localsConvention: 'camelCaseOnly',
              sourceMap: isDebug,
              modules: {
                localIdentName: isDebug ? '[name]-[local]-[hash:base64:5]' : '[hash:base64:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './postcss.config.js',
              },
            },
          },
          {
            test: /\.less$/,
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
          // {
          //   test: /\.(scss|sass)$/,
          //   loader: 'sass-loader',
          // },
        ],
      },
      {
        test: reImage,
        oneOf: [
          {
            issuer: reStyle,
            oneOf: [
              {
                test: /\.svg$/,
                loader: 'svg-url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },
              {
                loader: 'url-loader',
                options: {
                  name: staticAssetName,
                  limit: 4096, // 4kb
                },
              },
            ],
          },
          {
            loader: 'file-loader',
            options: {
              name: staticAssetName,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },
});

module.exports = {
  SRC_DIR,
  PUBIC_DIR,
  reScript,
  reStyle,
  reImage,
  staticAssetName,
  config,
};
