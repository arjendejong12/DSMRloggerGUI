import Vue from "vue";
import Vuex from "vuex";
import { FETCH_START, FETCH_END } from "./mutation-types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    smartMeter: [],
    hours: [],
    days: [],
    deviceInfo: [],
    settings: [],
    isLoading: true
  },
  mutations: {
    [FETCH_START](state) {
      state.isLoading = true;
    },
    [FETCH_END](state, { data, stateProperty }) {
      state.isLoading = false;
      state[stateProperty] = data;
    }
  },
  actions: {
    async getSmartMeter({ commit }) {
      commit(FETCH_START);
      try {
        const { data } = await Vue.axios.get("/sm/fields");
        commit(FETCH_END, { data: data.fields, stateProperty: "smartMeter" });
      } catch (error) {
        throw new Error(error);
      }
    },
    async getHours({ commit }) {
      commit(FETCH_START);
      try {
        const { data } = await Vue.axios.get("/hist/hours/asc");
        commit(FETCH_END, { data: data.hours, stateProperty: "hours" });
      } catch (error) {
        throw new Error(error);
      }
    },
    async getDays({ commit }) {
      commit(FETCH_START);
      try {
        const { data } = await Vue.axios.get("/hist/days/asc");
        commit(FETCH_END, { data: data.days, stateProperty: "days" });
      } catch (error) {
        throw new Error(error);
      }
    },
    async getDeviceInfo({ commit }) {
      commit(FETCH_START);
      try {
        const { data } = await Vue.axios.get("/dev/info");
        commit(FETCH_END, { data, stateProperty: "deviceInfo" });
      } catch (error) {
        throw new Error(error);
      }
    },
    async getSettings({ commit }) {
      commit(FETCH_START);
      try {
        const { data } = await Vue.axios.get("/dev/settings");
        commit(FETCH_END, { data: data.settings, stateProperty: "settings" });
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  modules: {}
});
