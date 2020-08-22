const pkg = require('./package.json');
const minimizeCssOptions = {
  discardComments: { removeAll: true },
};
const isDebug = process.env.NODE_DEV !== 'production';
module.exports = () => ({
  plugins: [
    require('postcss-import')(),
    require('postcss-preset-env')({
      stage: 3,
      browsers: pkg.browserslist,
      autoprefixer: { flexbox: 'no-2009' },
    }),
    ...(isDebug ? [] : require('cssnano')({ preset: ['default', minimizeCssOptions] })),
  ],
});
