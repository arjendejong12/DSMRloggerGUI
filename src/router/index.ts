import Vue from "vue";
import VueRouter from "vue-router";
import SmartMeter from "../views/SmartMeter.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "smart-meter",
    component: SmartMeter
    // component: () =>
    //   import(/* webpackChunkName: "smart-meter" */ "../views/SmartMeter.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
