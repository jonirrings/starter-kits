const { config } = require('./webpack.common.js');

module.exports = {
  ...config(false),
  mode: 'production',
};
