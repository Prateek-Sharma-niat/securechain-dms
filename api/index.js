const app = require('../server/server.js');

module.exports = (req, res) => {
  // Normalize req.url to ensure it always starts with /api so Express routes match
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + (req.url.startsWith('/') ? req.url : '/' + req.url);
  }
  return app(req, res);
};
