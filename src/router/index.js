import Vue from "vue";
import VueRouter from "vue-router";
import Actual from "../views/Actual.vue";
import PerHour from "../views/PerHour.vue";
import PerDay from "../views/PerDay.vue";
import PerMonth from "../views/PerMonth.vue";
import Charts from "../views/Charts.vue";
import Settings from "../views/Settings.vue";
import SystemInfo from "../views/SystemInfo.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "actual",
    component: Actual
    // component: () =>
    //   import(/* webpackChunkName: "actual" */ "../views/actual.vue")
  },
  {
    path: "/per-hour",
    name: "per-hour",
    component: PerHour
  },
  {
    path: "/per-day",
    name: "per-day",
    component: PerDay
  },
  {
    path: "/per-month",
    name: "per-month",
    component: PerMonth
  },
  {
    path: "/charts",
    name: "charts",
    component: Charts
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  },
  {
    path: "/system-info",
    name: "system-info",
    component: SystemInfo
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
