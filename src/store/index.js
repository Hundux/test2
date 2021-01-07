import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    collpsed: true,
    baseurl: 'http://106.12.9.121:8082/',
  },
  mutations: {
    changeCollpsed(state, newvalue) {
      state.collpsed = newvalue
    },
  },
  actions: {},
  modules: {}
});
