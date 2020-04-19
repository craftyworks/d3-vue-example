import Vue from 'vue'
import App from './App.vue'
import * as d3 from 'd3'
import axios from 'axios'

Vue.config.productionTip = false
Vue.set(Vue.prototype, 'd3', d3)
Vue.set(Vue.prototype, '$http', axios)

new Vue({
  render: h => h(App)
}).$mount('#app')
