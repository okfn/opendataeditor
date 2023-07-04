import { createProxyMiddleware } from 'http-proxy-middleware'

const middleware = function expressMiddleware(router: any) {
  router.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:4040',
      pathRewrite: { '^/api': '' },
      changeOrigin: true,
    })
  )
}
export default middleware
