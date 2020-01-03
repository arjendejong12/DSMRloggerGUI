import Vue from "vue";
import Vuetify from "vuetify/lib";
import i18n from "@/i18n";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: "#ee44aa",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
      }
    }
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params) as string
  },
  icons: {
    iconfont: "mdi"
  }
});
