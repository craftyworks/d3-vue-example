export default {
  install (Vue) {
    const constants = Object.freeze({
      MOBILE_WIDTH: 480
    })
    Vue.prototype.CONST = constants
  }
}
