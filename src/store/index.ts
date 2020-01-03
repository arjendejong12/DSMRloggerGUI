import Vue from "vue";
import Vuex from "vuex";
import { FETCH_START, FETCH_END } from "./mutation-types";

Vue.use(Vuex);

interface IState {
  [key: string]: any;
}

export default new Vuex.Store({
  state: {
    smartMeter: [],
    deviceInfo: [],
    isLoading: true
  },
  mutations: {
    [FETCH_START](state) {
      state.isLoading = true;
    },
    [FETCH_END](state: IState, { data, stateProperty }) {
      state.isLoading = false;
      state[stateProperty] = data;
    }
  },
  actions: {
    async getSmartMeter({ commit }) {
      commit(FETCH_START);
      try {
        const { data } = await Vue.axios.get("/sm/fields");
        commit(FETCH_END, { data, stateProperty: "smartMeter" });
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
    }
  },
  modules: {}
});
