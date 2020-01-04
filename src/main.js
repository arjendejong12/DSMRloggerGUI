import Vue from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import VueAxios from "vue-axios";

// Set API URLs for development and production.
const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://192.168.178.101/api/v1"
    : "http://" + location.host + "/api/v1";
axios.defaults.baseURL = baseURL;
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
