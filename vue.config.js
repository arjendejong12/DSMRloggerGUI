module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
  filenameHashing: false,
  configureWebpack: {
    optimization: {
      splitChunks: false
    },
    output: {
      filename: "[name].js"
    }
  },
  chainWebpack: config => {
    config.externals({
      ...config.get("externals"),
      moment: "moment"
    });
  },
  css: {
    extract: {
      filename: "[name].css"
    }
  }
};
