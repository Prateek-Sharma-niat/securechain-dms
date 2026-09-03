const app = require('../server/server.js');

module.exports = (req, res) => {
  const originalUrl = req.headers['x-forwarded-uri'] || req.url;
  if (originalUrl) {
    req.url = originalUrl;
  }
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
};
