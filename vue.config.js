process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
  ? '/dazi/'
  : '/',
  devServer: {
    port: 6001,
    historyApiFallback: true,
    disableHostCheck: true,
    public: 'http://dazi.saileidigi.cn'
  },
}
