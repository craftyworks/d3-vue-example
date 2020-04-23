import { format } from 'd3'

export default {
  install (Vue) {
    const mixin = {
      data () {
        return {
          steps: [
            { c: '#F63538', v: -5 },
            { c: '#F63538', v: -3 },
            { c: '#BF4045', v: -2 },
            { c: '#8B444E', v: -1 },
            { c: '#414554', v: 0 },
            { c: '#35764E', v: 1 },
            { c: '#2F9E4F', v: 2 },
            { c: '#30CC5A', v: 3 },
            { c: '#30CC5A', v: 5 }
          ],
          steps_red_blue: [
            { c: '#1939B7', v: -5 },
            { c: '#254EDB', v: -3 },
            { c: '#3366FF', v: -1 },
            { c: '#6690FF', v: -0.1 },
            { c: '#bfc5c9', v: 0 },
            // { c: '#414554', v: 0 },
            { c: '#FF503D', v: 0.1 },
            { c: '#f22613', v: 1 },
            { c: '#D00E0D', v: 3 },
            { c: '#AE0916', v: 5 }
          ]
        }
      },
      computed: {
        stepsFilter () {
          // return this.steps_red_blue.filter(e => e.v !== 0.1 && e.v !== -0.1).reverse()
          return this.steps.filter(e => e.v < 5 && e.v > -5).reverse()
        }
      },
      methods: {
        formatNumber: format(','),
        formatFloat: format(',.2f')
      }
    }
    Vue.mixin(mixin)
  }
}
