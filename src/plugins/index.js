import lodash from './lodash'
import Const from './const'
import Util from './util'
import axios from './axios'
import d3 from './d3'

export default {
  install (Vue) {
    Vue.use(lodash)
    Vue.use(Const)
    Vue.use(Util)
    Vue.use(axios)
    Vue.use(d3)
  }
}
