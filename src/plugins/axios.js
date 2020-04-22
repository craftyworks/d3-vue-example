import axios from 'axios'

export default {
  install (Vue) {
    Vue.set(Vue.prototype, '$http', axios)
  }
}
