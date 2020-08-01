import Vue from 'vue'

let message = {
    successMessage(message) {
        Vue.prototype.$message.closeAll()
        Vue.prototype.$message({
            showClose: true,
            message: message,
            duration: 5000,
            type: 'success'
        });
    },
    warningMessage(message) {
        Vue.prototype.$message.closeAll()
        Vue.prototype.$message({
            showClose: true,
            message: message,
            duration: 5000,
            type: 'warning'
        });
    },
    errorMessage(message) {
        Vue.prototype.$message.closeAll()
        Vue.prototype.$message({
            showClose: true,
            message: message,
            duration: 5000,
            type: 'error',
        });
    }
}

export default {
    install(Vue) {
        Vue.prototype.$myMessage = message
    }
}