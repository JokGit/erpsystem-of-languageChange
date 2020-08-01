import axios from "axios";
import store from "../../store.js";
import router from '../../router.js'
import Vue from "vue";

axios.defaults.baseURL = "http://192.168.66.101:8088/anems/api";
axios.defaults.withCredentials = true;

// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    if (store.getters.getStoreToken != null) {
      config.headers.token = store.getters.getStoreToken;
    } 
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 身份过期
    if (response.data.code == 421) {
      store.commit('loginOut')
      router.push("/login");
      Vue.prototype.$myMessage.errorMessage('身份过期，请重新登录')
    }
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

let request = {
  // 9.1 登录接口
  doLogin(params) {
    return axios.post("/doLogin", params);
  },

  // 9.2 获取验证码
  getImageCode() {
    return axios.get("/getImageCode", {
      responseType: "blob",
    });
  },

  // 9.3 注册用户接口
  setUser(params) {
    return axios.post('/setUser', params)
  },

  // 查询所有职位接口
  getDepartmentList() {
    return axios.post("/getDepartmentList");
  },

  // -------------- 运维系统接口 ---------------------------------------

  // 7.1 修改密码
  doChangePassword(params) {
    return axios.post('/doChangePassword', params)
  },

  // 7.2 退出登录
  doLogout() {
    return axios.post("/doLogout");
  },

  // 8.1 查询项目管理列表数据
  getProjectList(params) {
    return axios.post("/getProjectList", params);
  },

  // 8.2 新建项目
  setProject(params) {
    return axios.post("/setProject", params);
  },

  // 8.3 删除项目
  delProject(params) {
    return axios.post("/delProject", params);
  },

  // 8.4 生成注册码
  doGenRegisterCode(params) {
    return axios.post("/doGenRegisterCode", params);
  },

  // 9.1 搜索注册
  getHistoryRegisterList(params) {
    return axios.post("/getHistoryRegisterList", params);
  },

  // 10.1 搜索用户注册
  getUserList(params) {
    return axios.post("/getUserList", params);
  },

  // 10.2 新建/编辑用户
  setUser(params) {
    return axios.post("/setUser", params);
  },

  // 10.3 删除用户
  delUser(params) {
    return axios.post("/delUser", params);
  },

  // -------------- 配单系统接口 ---------------------------------------
  // 6.1 获取任务列表接口
  getSalesTaskAll(params) {
    return axios.post('/getSalesTaskAll', params)
  },

  // 6.2 任务详情
  getSalesTaskById(params) {
    return axios.post('/getSalesTaskById', params)
  },

  // 6.3 新建/编辑 销售任务
  addSalesTask(params,config) {
    return axios.post('/addSalesTask', params,config)
  },

  // 编辑技术任务
  updateTechnologyTask(params) {
    return axios.post('/updateTechnologyTask', params)
  },

  // 项目详情，销售栏附件下载
  // downloadFile(params) {
  //   return axios.get('/downloadFile',{params})
  // },

  // 项目详情，技术栏导出配单
  exportExcel(params) {
    let aEle = document.createElement('a')
    document.body.appendChild(aEle)
    aEle.style.display = 'none'
    aEle.target = '_blank'
    aEle.href = axios.defaults.baseURL+"/exportExcel?tId=" + params
    aEle.click()
    document.body.removeChild(aEle)
  },

  // 删除销售任务
  deleteSalesTask(params) {
    return axios.post('/deleteSalesTask', params)
  },

  // 7.2 技术人员接单
  addTechnologyTask(params) {
    return axios.post('/addTechnologyTask', params)
  }, 

  // 7.4 技术--> 查询技术人员配单数据接口
  getMatchingOrder(params) {
    return axios.post('/getMatchingOrder', params)
  },

  // 7.5 获取产品列表接口
  getProductByNameOrVersion(params) {
    return axios.post('/getProductByNameOrVersion', params)
  },

  // 技术配单  配单中添加产品
  addMatchingOrder(params) {
    return axios.post('/addMatchingOrder', params)
  },

  // 7.6 技术人员配单   删除配单产品
  delMatchingOrderById(params) {
    return axios.post('/delMatchingOrderById', params)
  },

  // 7.7 新增产品
  addProduct(params,config) {
    return axios.post('/addProduct', params, config)
  },
  

  // 删除产品
  delateProductCenter(params) {
    return axios.post('/delateProductCenter', params)
  },

  // 8.4 新增产品类型
  addProductType(params) {
    return axios.post('/addProductType', params)
  },

  // 8.5 查询产品类型
  queryProductType(params) {
    return axios.post('/queryProductType', params)
  },

  // 8.6 删除产品类型
  deleteProductType(params) {
    return axios.post('/deleteProductType', params)
  },

  // 技术人员完成配单
  finishOrder(params) {
    return axios.post('/finishOrder',params)
  }

};

export default {
  install(Vue) {
    Vue.prototype.$request = request;
  },
};
