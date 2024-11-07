const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.setHeader("CDN-Cache-Control", "no-store");
        res.setHeader("Cache-Control", "no-store, must-revalidate ");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
        next();
    });
};