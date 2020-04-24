import { min, mean, max, extent, select, nest, range, scaleLinear, format, line, curveBasis } from 'd3'

export default {
  install (Vue) {
    const d3 = Object.assign({}, { min, mean, max, extent, select, nest, range, scaleLinear, format, line, curveBasis })
    Vue.set(Vue.prototype, 'd3', d3)
  }
}
