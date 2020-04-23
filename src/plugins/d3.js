import { min, mean, max, select, nest, scaleLinear, format } from 'd3'

export default {
  install (Vue) {
    const d3 = { min: min, mean: mean, max: max, select: select, nest: nest, scaleLinear: scaleLinear, format: format }
    Vue.set(Vue.prototype, 'd3', d3)
  }
}
