const path = require('path')

process.env.VUE_APP_VERSION = require('./package.json').version
const cdnRootPath = 'https://cdn.jsdelivr.net/gh/lin09/dist/dazi/'

module.exports = {
  chainWebpack: config => {
    var min = process.env.NODE_ENV === 'production' ? '.min' : ''
    var cdnUrlBase = 'https://cdn.jsdelivr.net/npm'
    var externals = {
      axios: 'axios',
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'ant-design-vue': 'antd'
    }

    config.externals(externals)

    const cdn = {
      css: [
        `${cdnUrlBase}/ant-design-vue@2.0.0-rc.3/dist/antd${min}.css`
      ],
      js: [
        `${cdnUrlBase}/vue@3.0.4/dist/vue.global${min}.js`,
        `${cdnUrlBase}/vuex@4.0.0-rc.2/dist/vuex.global${min}.js`,
        `${cdnUrlBase}/vue-router@4.0.1/dist/vue-router.global${min}.js`,
        `${cdnUrlBase}/axios@0.21.0/dist/axios${min}.js`,
        `${cdnUrlBase}/ant-design-vue@2.0.0-rc.3/dist/antd${min}.js`
      ]
    }
    // 通过 html-webpack-plugin 将 cdn 注入到 index.html 之中
    config.plugin('html')
      .tap(args => {
        args[0].cdn = cdn
        return args
      })

    config.plugin('manifest-plugin')
      .use(require(path.resolve(__dirname, 'manifestPlugin.js')))
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  outputDir: 'dazi',
  publicPath: process.env.NODE_ENV === 'production'
  ? cdnRootPath
  : '/',
  devServer: {
    port: 6001,
    historyApiFallback: true,
    disableHostCheck: true,
    public: 'http://dazi.saileidigi.cn'
  },
  pwa: {
    name: '打字练习',
    manifestOptions: {
      start_url: '/dazi'
    },
    workboxOptions: {
      importScripts: 'https://cdn.jsdelivr.net/npm/workbox-cdn@5.1.4/workbox/workbox-sw.min.js'
    }
  }
}
