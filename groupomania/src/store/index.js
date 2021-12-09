import Vue from 'vue'
import Vuex from 'vuex'

const axios = require('axios');

const instance = axios.create({
  baseURL: 'http://localhost:3000/'
});

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    createAccount: ({commit}, userInfos) => {
      commit;

      console.log(userInfos);

      instance.post('/signup', userInfos)
      .then(function (res) {
        console.log(res);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  },
  modules: {
  }
})
