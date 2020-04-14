const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
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
