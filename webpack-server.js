const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config.babel");

module.exports = (PORT) => {
    config.entry.unshift(`webpack-dev-server/client?http://localhost:${PORT}/`, "webpack/hot/dev-server");

    const server = new WebpackDevServer(webpack(config), {
        port: process.env.PORT || 8080,
        host: 'localhost',
        colors: true,
        publicPath: '/',
        contentBase: './src',
        historyApiFallback: true,
        open: true,
        proxy: {
            "*" : `http://localhost:${PORT - 1}`
        }
    });
    server.listen(PORT, 'localhost');
}