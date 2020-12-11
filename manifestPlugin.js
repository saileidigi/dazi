const _ = require('lodash')
function manifestPlugin(options) {}
const cdnRootPath = 'https://cdn.jsdelivr.net/gh/lin09/dist'
const cdnRE = new RegExp(cdnRootPath + '(\/dazi\/(index.html|manifest.json|robots.txt))', 'g')

manifestPlugin.prototype.apply = function(compiler) {
  compiler.hooks.emit.tap('manifest', function(compilation) {
    _.forEach(compilation.assets, (asset, filename) => {
      if (/^(precache-manifest\..+\.js|index.html)$/.test(filename)) {
        // 更改 缓存路径
        let source = asset.source().replace(cdnRE, '$1')
        asset.source = function() { return source }
      } else if (filename === 'manifest.json') {
        // 更改 icons 路径到 cdn
        let source = asset.source().replace(/\.(\/img\/icons)/g, cdnRootPath + '/dazi$1')
        asset.source = function() { return source }
      } else if (filename === 'service-worker.js') {
        // workbox cdn
        let source = asset.source().replace(
          /https:\/\/storage.+workbox-sw\.js/,
          'https://cdn.jsdelivr.net/npm/workbox-cdn@4.3.1/workbox/workbox-sw.js'
        )
        asset.source = function() { return source }
      }
    })
  });
};

module.exports = manifestPlugin;