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
  },
  pluginOptions: {
    i18n: {
      locale: "nl",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true
    }
  }
};
