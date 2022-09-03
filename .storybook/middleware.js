const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function expressMiddleware(router) {
  router.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4040',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    })
  )
}
