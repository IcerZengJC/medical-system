import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      username: "",
      password: "",
    },
  },
  getters: {
    getData: (state) => {
      // console.log(state);
      return state.user;
    },
  },
  mutations: {
    setData(state, loginInfo) {
      state.user = {
        username: loginInfo.username,
        password: loginInfo.password,
      };
    },
  },
});
