import { mapState, mapMutations } from 'vuex'

export default {
  install (Vue) {
    const mixin = {
      data () {
        return {
          steps: [
            { c: '#1939B7', v: -5 },
            { c: '#254EDB', v: -3 },
            { c: '#3366FF', v: -1 },
            { c: '#6690FF', v: -0.1 },
            // { c: '#868e96', v: 0 },
            { c: '#414554', v: 0 },
            { c: '#FF503D', v: 0.1 },
            { c: '#f22613', v: 1 },
            { c: '#D00E0D', v: 3 },
            { c: '#AE0916', v: 5 }
          ]
        }
      },
      computed: {
        stepsFilter () {
          return this.steps.filter(e => e.v !== 0.1 && e.v !== -0.1).reverse()
        },
        ...mapState(['mouse', 'mobileDevice'])
      },
      methods: {
        ...mapMutations(['mutate'])
      }
    }
    Vue.mixin(mixin)
  }
}
