import Vue from "vue";
import Vuex from "vuex";
import { FETCH_START, FETCH_END } from "./mutation-types";

Vue.use(Vuex);

const apiRequest = async (
  type = "get",
  route,
  stateProperty,
  commit,
  payload = false
) => {
  // Don't change loading status after initial request.
  if (payload !== true) {
    commit(FETCH_START);
  }

  try {
    if (type === "post") {
      await Vue.axios.post(route, payload);
    } else {
      let { data } = await Vue.axios.get(route);
      data = data[Object.keys(data)[0]]; // Get the first (and only) object.
      commit(FETCH_END, {
        data,
        stateProperty: stateProperty
      });
    }
  } catch (error) {
    throw new Error(error);
  }
};

export default new Vuex.Store({
  state: {
    smartMeter: [],
    actual: [],
    hours: [],
    days: [],
    months: [],
    deviceInfo: [],
    settings: [],
    isLoading: true
  },
  mutations: {
    [FETCH_START](state) {
      state.isLoading = true;
    },
    [FETCH_END](state, { data, stateProperty } = {}) {
      state.isLoading = false;
      if (typeof data !== "undefined" && typeof stateProperty !== "undefined") {
        state[stateProperty] = data;
      }
    }
  },
  actions: {
    getSmartMeter({ commit }) {
      return apiRequest("get", "/sm/fields", "smartMeter", commit);
    },
    getActual({ commit }, payload) {
      return apiRequest("get", "/sm/actual", "actual", commit, payload);
    },
    getHours({ commit }) {
      return apiRequest("get", "/hist/hours/asc", "hours", commit);
    },
    getDays({ commit }) {
      return apiRequest("get", "/hist/days/asc", "days", commit);
    },
    getMonths({ commit }) {
      return apiRequest("get", "/hist/months/asc", "months", commit);
    },
    getDeviceInfo({ commit }) {
      return apiRequest("get", "/dev/info", "deviceInfo", commit);
    },
    getSettings({ commit }) {
      return apiRequest("get", "/dev/settings", "settings", commit);
    },
    postSettings({ commit }, payload) {
      return apiRequest("post", "/dev/settings", "", commit, payload);
    },
    setLoadingStatus({ commit }, payload) {
      if (payload === true) {
        commit(FETCH_START);
      } else if (payload === false) {
        commit(FETCH_START);
      }
    }
  },
  modules: {}
});
