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
      isAdmin: null
    },
    oneUserInfos: {
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
    oneUserInfos: function (state, oneUserInfos) {
      state.oneUserInfos = oneUserInfos;
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
    getOneUserInfos: ({commit}, pageId) => {
      const id = pageId
      instance.get(`/users/${id}`)
        .then(function (res) {
          commit('oneUserInfos', res.data);
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
    updatePost: ({commit}, postInfos) => {
      commit('setStatus', 'loading');
      let postId = postInfos.get('postId');
      postInfos.delete('postId');
      return new Promise((resolve, reject) => {
        commit;
        instance.put(`/posts/${postId}`, postInfos, {headers: {
          'Content-Type' : 'multipart/form-data; boundary="----arbitrary boundary"  '
        }})
        .then(function (res) {
          commit('setStatus', 'updated');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_updating_post');
          reject(error);
        });
      });
    },
    likePost: ({commit}, postId) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        let idPost = postId
        instance.post(`/posts/${idPost}/vote/like`)
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
    commentPost: ({commit}, commentInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        let idPost = commentInfos.postId
        instance.post(`/posts/${idPost}/comment`, {
          comment: commentInfos.comment
        })
        .then(function (res) {
          commit('setStatus', 'commented');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_comment_post');
          reject(error);
        });
      });
    },
    deletePost: ({commit}, postInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        let idPost = postInfos
        instance.delete(`/posts/${idPost}`)
        .then(function (res) {
          commit('setStatus', 'deleted');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_deleting_post');
          reject(error);
        });
      });
    },
    deleteComment: ({commit}, commentInfos) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        let commentId = commentInfos
        instance.delete(`/comment/${commentId}/delete`)
        .then(function (res) {
          commit('setStatus', 'deleted');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_deleting_comment');
          reject(error);
        });
      });
    },
    updateComment: ({commit}, comment) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        let commentId = comment.id
        instance.put(`/comment/${commentId}/update`, {
          comment: comment.comment
        })
        .then(function (res) {
          commit('setStatus', 'updated');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_updating_comment');
          reject(error);
        });
      });
    },
    deleteAccount: ({commit}, user) => {
      commit('setStatus', 'loading');
      return new Promise((resolve, reject) => {
        commit;
        let userId = user
        instance.delete(`/users/${userId}`)
        .then(function (res) {
          commit('setStatus', 'account deleted');
          resolve(res);
        })
        .catch(function (error) {
          commit('setStatus', 'error_deleting_account');
          reject(error);
        });
      });
    },
  },
  modules: {
  }
})
