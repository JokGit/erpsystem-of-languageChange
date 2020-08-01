import Vue from 'vue'

// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入基础样式
import './lib/base.css'

// 覆盖element-ui样式
import './lib/coverEl-ui.css'

// 导入路由
import router from './router.js'

// 注入 Vuex
import store from './store.js'

// 导入文本提示
import myMessage from './lib/message/message.js'
Vue.use(myMessage)

// 导入自定义组件
import './tool/myplugin.js'

// 导入加密工具
import base64 from './lib/base64.js'
Vue.use(base64)

// 导入axios请求
import http from './lib/http/http.js'
Vue.use(http)

// 语言
// import language from './lib/language/language.js'
// Vue.use(language)

// 语言
import './lib/language/language.js'

// 自定义指令
import './lib/diyDir/directive.js'

// 导入 App 组件
import App from './App.vue'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
