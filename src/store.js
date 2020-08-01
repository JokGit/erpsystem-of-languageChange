import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);


const store = new Vuex.Store({
  state: {
    token: sessionStorage.getItem("token") || null,
    userInfo: JSON.parse(sessionStorage.getItem("userInfo")) || null,
    currentPagePath: sessionStorage.getItem("currentPagePath") || '',
    projectDetailsId: sessionStorage.getItem("projectDetailsId") || null,
    userDepart: JSON.parse(sessionStorage.getItem("userDepart")) || [],
    language: sessionStorage.getItem("language") || 'ch',
    languageText:{}
  },
  mutations: {
    // 修改token
    changeToken(state, newData) {
      state.token = newData;
      sessionStorage.setItem("token", newData);
    },

    // 修改用户信息
    changeUserInfo(state, newData) {
      state.userInfo = newData;
      sessionStorage.setItem("userInfo", JSON.stringify(newData));
    },

    // 修改用户权限
    changeUserDepart(state, newData) {
      state.userDepart = newData;
      sessionStorage.setItem("userDepart", JSON.stringify(newData));
    },

    // 修改当前页
    changeCurrentPagePath(state, newData) {
      state.currentPagePath = newData;
      sessionStorage.setItem("currentPagePath", newData);
    },

    // 需要查看项目详情的id
    changeProjectDetailsId(state, newData) {
      state.projectDetailsId = newData
      sessionStorage.setItem("projectDetailsId", newData);
    },

    // 修改语言
    changeLanguage(state, newData) {
      state.language = newData
      sessionStorage.setItem("language", newData);
    },

    changeLanguageText(state, newData) {
      state.languageText = newData
      console.log('设置中英文',newData);
      // sessionStorage.setItem("languageText", newData);
    },

    // 修改密码或者退出登录
    loginOut(state) {
      sessionStorage.clear()
      state.token = null,
      state.userInfo = null,
      state.currentPagePath = "",
      state.projectDetailsId = null
      state.userDepart = []
    }
  },
  getters: {
    getStoreToken: (state) => {
      return state.token;
    },

    getCurrentPagePath: (state) => {
      return state.currentPagePath;
    },

    getUserInfo: (state)=> {
      return state.userInfo
    },

    getLanguageText: (state)=> {
      return state.languageText
    }
  },
});

export default store;
