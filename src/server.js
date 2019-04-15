import App from "./containers/App/index";
import React from "react";
import StaticRouter from "react-router-dom/StaticRouter";
import express from "express";
import httpProxy from "http-proxy";
import compression from "compression";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { parse as parseUrl } from "url";
import { renderToString } from "react-dom/server";
import configureStore from "./config/store";

const fs = require("fs");

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const targetUrl = process.env.API_HOST || "https://api.tribecapr.co.za/";

const proxy = httpProxy.createProxyServer({
  target: targetUrl,
  changeOrigin: true,
  pathRewrite: { "^/api": "" }
});
const sitemap_proxy = httpProxy.createProxyServer({
  target: "https://api.tribecapr.co.za/",
  changeOrigin: true,
  pathRewrite: { "^/api": "" }
});

const server = express();

server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use(compression())
  .use("/api", (req, res) => {
    proxy.web(req, res, { target: targetUrl });
  })
  .get("/sitemap.xml", (req, res) => {
    sitemap_proxy.web(req, res, {
      target: "https://api.tribecapr.co.za/"
    });
  })
  .get("/*", async (req, res) => {
    // Render the app
    // const context = {};
    const url = req.originalUrl || req.url;
    const location = parseUrl(url);
    const staticRouter = new StaticRouter();
    staticRouter.props = { location, context: {}, basename: "" };
    const history = staticRouter.render().props.history;

    const store = configureStore({}, history);

    const app = (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    );

    // Render to html markup
    const markup = renderToString(app);
    res.send(
      `<!doctype html>
        <html lang="en">
        <meta charset="UTF-8">
        <meta name="description" content="Wilderness holdings">
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta charSet='utf-8' />
            <title>Website</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            ${
              assets.client.css
                ? `<link rel="stylesheet" href="${assets.client.css}">`
                : ""
            } 
          </head>
          <body>
            <div id="root">${markup}</div>
            <script src="${assets.client.js}" crossorigin></script>
                        <!-- Global site tag (gtag.js) - Google Analytics -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=UA-136097391-1"></script>
          </body>
        </html>`
    );
  });

export default server;
