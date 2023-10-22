const path = require('path')

process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  chainWebpack: config => {
    var min = process.env.NODE_ENV === 'production' ? '.min' : ''
    var cdnUrlBase = 'https://cdn.staticfile.org'
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
        `${cdnUrlBase}/ant-design-vue/2.0.0-rc.3/antd${min}.css`
      ],
      js: [
        `${cdnUrlBase}/vue/3.0.4/vue.global${min && '.prod'}.js`,
        `${cdnUrlBase}/vuex/4.0.0-rc.2/vuex.global${min && '.prod'}.js`,
        `${cdnUrlBase}/vue-router/4.0.1/vue-router.global${min && '.prod'}.js`,
        `${cdnUrlBase}/axios/0.21.0/axios${min}.js`,
        `${cdnUrlBase}/ant-design-vue/2.0.0-rc.3/antd${min}.js`
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
  publicPath: process.env.NODE_ENV === 'production'
  ? '/dazi'
  : '/',
  devServer: {
    port: 6001,
    historyApiFallback: true,
    disableHostCheck: true,
    // public: 'http://dazi.useless-os.xyz'
  },
  pwa: {
    name: '打字练习',
    manifestOptions: {
      start_url: '/dazi/'
    }
  }
}
