export default {
  install (Vue) {
    const constants = Object.freeze({
      MOBILE_WIDTH: 600,
      MIN_PC_SCREEN: { width: 1000, height: 700 },
      MIN_MOBILE_SCREEN: { width: 600, height: 1000 }
    })
    Vue.prototype.CONST = constants
  }
}
