/*
*/
const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://18.117.21.81:80',
      secure: false,
      changeOrigin: true,
    })
  );
};