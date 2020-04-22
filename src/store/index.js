import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    mobileDevice: false,
    showModal: false,
    mouse: { left: 100, top: 100, stockCode: null }
  },
  mutations: {
    mutate: (store, payload) => {
      store[payload.name] = payload.value
    }
  }
})

export default store
