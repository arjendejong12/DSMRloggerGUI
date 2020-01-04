module.exports = {
  transpileDependencies: ["vuetify"],
  productionSourceMap: false,
  filenameHashing: false,
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  },
  chainWebpack: config => {
    config.externals({
      ...config.get("externals"),
      moment: "moment"
    });

    config.output.filename("[name].js");
  }
};
