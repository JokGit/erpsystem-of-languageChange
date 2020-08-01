import Vue from 'vue'

// 导入自定义按钮
import button from './button/button.vue'

// 导入自定义工具条
import toolBar from './toolBar/toolBar.vue'

// 导入自定义table表格
import table from './table/table.vue'

// 导入自定义图片上传组件
import uploadImage from './uploadImage/uploadImage.vue'

// 导入图片查看组件
import viewImage from './viewImage/viewImage.vue'

// 创建全局组件
Vue.component('myButton',button)
Vue.component('myToolBar',toolBar)
Vue.component('myTable',table)
Vue.component('myUploadImage',uploadImage)
Vue.component('myViewImage',viewImage)
