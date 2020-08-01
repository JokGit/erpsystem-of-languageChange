import { Base64 } from 'js-base64';

export default {
    install(Vue) {
        Vue.prototype.$Base64 = Base64
    }
}