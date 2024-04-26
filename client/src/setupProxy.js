const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api"],
    createProxyMiddleware({
      target: "http://localhost:5000",
      // 'http://localhost:5000' || 'https://e-param-4179c775a38d.herokuapp.com:5000' || 'https://www.eparam.online',
    })
  );
};
