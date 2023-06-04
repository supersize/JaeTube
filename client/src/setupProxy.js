/*
*/
const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // target: 'http://localhost:5001', // basic local node port : 5000 / bosic react port : 3000 
      target: 'http://18.117.21.81:3001',
      secure: false,
      changeOrigin: true,
    })
  );
};