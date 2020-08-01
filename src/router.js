import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)


// 导入组件
import login from './components/login.vue'
import index from './components/index.vue'
import projectManagement from './page/projectManagement/projectManagement.vue'
import regManagement from './page/regManagement/regManagement.vue'
import userManagement from './page/userManagement/userManagement.vue'
import projectList from './page/projectList/projectList.vue'
import projectDetails from './page/projectDetails/projectDetails.vue'
import deployTerminal from './page/projectDetails/deployTerminal.vue'
import products from './page/products/products.vue'

let routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: login
    },
    {
        path: '/index',
        component: index,
        children: [
            // {
            //     path: '',
            //     redirect: 'project-management'
            // },
            // {
            //     path: '',
            //     redirect: 'project-management'
            // },
            {
                path: 'project-management',
                component: projectManagement
            },
            {
                path: 'reg-management',
                component: regManagement
            },
            {
                path: 'user-management',
                component: userManagement
            },
            {
                path: 'project-list',
                component: projectList
            },
            {
                path: 'project-details',
                component: projectDetails
            },
            {
                path: 'deploy-terminal/:tId',
                // path: 'deploy-terminal',
                // name:'deployTerminal',
                component: deployTerminal
            },
            {
                path: 'products',
                component: products
            },
        ]
    }
]

// 实例化路由对象
let router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (!sessionStorage.getItem("token")) {
        if (to.path == "/login") {
            next();
        } else {
            next("login");
        }
    } else {
        next();
    }
})

export default router
