require('dotenv').config();
const { config, PUBIC_DIR } = require('./webpack.common.js');

module.exports = {
  ...config(true),
  bail: false,
  cache: true,
  mode: 'development',
  devtool: 'inline-cheap-module-source-map',
  devServer: {
    contentBase: PUBIC_DIR,
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000,
    hot: true,
    open: false,
    proxy: [
      {
        context: ['/api', '/images'],
        target: process.env.PROXY_TARGET || 'http://10.66.241.81:8888',
        secure: false,
      },
    ],
  },
};
