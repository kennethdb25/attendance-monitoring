const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(
    ["/api"],
    createProxyMiddleware({
      target:
        "http://localhost:5000" ||
        "https://attendance-monitoring-aea3962f035e.herokuapp.com:5000" ||
        "https://www.traceguard.online"
    })
  );
};
