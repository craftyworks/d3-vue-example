export default {
  install (Vue) {
    const constants = Object.freeze({
      MOBILE_WIDTH: 480,
      MIN_WIDTH: 800,
      MIN_HEIGHT: 600
    })
    Vue.prototype.CONST = constants
  }
}
