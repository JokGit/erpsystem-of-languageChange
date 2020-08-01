import ch from './ch.js'
import en from './en.js'
import store from '../../store.js'
import Vue from 'vue'

let languageText
if(store.state.language == "ch") {
    languageText = ch
} else if (store.state.language == "en") {
    languageText = en
}
store.commit('changeLanguageText',languageText)

let temp = store.state.language

Object.defineProperty(store.state,'language',{
    get() {
        console.log('获取值');
        return temp
    },
    set(val) {
        console.log('设置值');
        temp = val
        if(val == "ch") {
            languageText = ch
        } else if (val == "en") {
            languageText = en
        }
        store.commit('changeLanguageText',languageText)
    }
})

// let languageText

// if(store.state.language == "ch") {
//     languageText = ch
// } else if (store.state.language == "en") {
//     languageText = en
// }

// let temp = store.state.language

// Object.defineProperty(store.state,'language',{
//     get() {
//         console.log('获取值');
//         return temp
//     },
//     set(val) {
//         console.log('设置值');
//         temp = val
//         if(val == "ch") {
//             languageText = ch
//         } else if (val == "en") {
//             languageText = en
//         }
//         Vue.prototype.$languageText = languageText
//     }
// })

// export default {
//     install(Vue) {
//         Vue.prototype.$languageText = languageText
//     }
// }
