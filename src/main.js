import Vue from 'vue'
import App from './App.vue'
import * as d3 from 'd3'

Vue.config.productionTip = false
Vue.set(Vue.prototype, 'd3', d3)

new Vue({
  render: h => h(App)
}).$mount('#app')
