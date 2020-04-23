import Vue from 'vue'
import Vuex, { mapMutations, mapState } from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    mobileDevice: false,
    window: { width: 0, height: 0 }
  },
  mutations: {
    mutate: (store, payload) => {
      store[payload.name] = payload.value
    }
  }
})

const mixin = {
  computed: mapState(['window', 'mobileDevice']),
  methods: mapMutations(['mutate'])
}
Vue.mixin(mixin)

export default store
