import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'

const axios = require('axios');


const instance = axios.create({
  baseURL: 'http://localhost:3000/api/'
});

let user = localStorage.getItem('user');
if (!user) {
  user = {
    userId: -1,
    token: '',
  };
} else {
  try {
    user = JSON.parse(user);
    instance.defaults.headers.common['Authorization'] = user.token;
  } catch (ex) {
    user = {
      userId: -1,
      token: '',
    };
  }
}

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    user: user,
    userInfos: {
      userId: null,
      email: '',
      name: '',
      lastname: '',
      bio: '',
    },
    postInfos: {
      content: '',
    },
    modifiedUserInfos: {
      bio: '',
      name: '',
      lastname: '',
      imageUrl: '',
    },
    allPosts: [],
  },
  mutations: {
    setStatus: function (state, status) {
      state.status = status;
    },
    logUser: function (state, user) {
      instance.defaults.headers.common['Authorization'] = user.token;
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    userInfos: function (state, userInfos) {
      state.userInfos = userInfos;
    },
    logout: function (state) {
      state.user = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('user');
    },
    allPosts: function (state, allPosts) {
      state.allPosts = allPosts;
    }
  },
  actions: {
    loginAccount: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        instance.post('/users/login', userInfos)
        .then(function (res) {
          commit('setStatus', '');
          commit('logUser', res.data);
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_login');
          reject(error);
        });
      });
    },
    createAccount: ({commit}, userInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        instance.post('/users/register', userInfos)
        .then(function (res) {
          commit('setStatus', 'created');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_create');
          reject(error);
        });
      });
    },
    getUserInfos: ({commit}) => {
      instance.get('/users/me')
        .then(function (res) {
          commit('userInfos', res.data);

        })
        .catch(function () {
          
        });
    },
    changeProfil: ({commit}, modifiedUserInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        instance.put('/users/me', modifiedUserInfos, {headers: {
          'Content-Type' : 'multipart/form-data; boundary="----arbitrary boundary"  '
        }})
        .then(function (res) {
          commit('setStatus', 'user_modified');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_modifying');
          reject(error);
        });
      });
    },
    createPost: ({commit}, postInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        instance.post('/posts/new', postInfos, {headers: {
          'Content-Type' : 'multipart/form-data; boundary="----arbitrary boundary"  '
        }})
        .then(function (res) {
          commit('setStatus', 'posted');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_create_post');
          reject(error);
        });
      });
    },
    getAllPosts: ({commit}) => {
      instance.get('/posts')
        .then(function (res) {
          commit('allPosts', res.data);
          

        })
        .catch(function () {
          
        });
    },
    likePost: ({commit}, postId) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        let idPost = postId
        instance.put(`/posts/${idPost}/like`, {
          likeOrDislike : 1
        })
        .then(function (res) {
          commit('setStatus', 'liked');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_like_post');
          reject(error);
        });
      });
    },
    dislikePost: ({commit}, postId) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        let idPost = postId
        instance.put(`/posts/${idPost}/like`, {
          likeOrDislike : -1
        })
        .then(function (res) {
          commit('setStatus', 'disliked');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_dislike_post');
          reject(error);
        });
      });
    }

  },
  modules: {
  }
})
