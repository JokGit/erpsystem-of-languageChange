import Vue from 'vue'
import store from '../../store.js'

Vue.directive('myText', function (el,binding) {
      // console.log(binding.value,'自定义指令');
      let temp = binding.value
      el.innerHTML = store.getters.getLanguageText[temp]
    },
)