const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  devServer: {
    proxy: {
      "/": {
        target: "http://127.0.0.1:7878",
        changeOrigin: true
      }
    }
  },
  pages: {
    index: "example/main.js"
  },
  configureWebpack: {
    output: {
      libraryExport: "default"
    }
  },
  chainWebpack(config) {
    config.resolve.alias
      .set("@", resolve("example/"))
      .set("components", resolve("src/components"));
  }
};
