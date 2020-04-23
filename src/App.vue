<template>
  <div id="app">
    <stock-screen></stock-screen>
    <app-footer></app-footer>
  </div>
</template>

<script>
import AppFooter from './components/AppFooter'
import StockScreen from './components/StockScreen'

export default {
  name: 'App',
  components: {
    StockScreen, AppFooter
  },
  methods: {
    onSize () {
      this.mutate({ name: 'window', value: { width: window.innerWidth, height: window.innerHeight } })
      this.mutate({ name: 'mobileDevice', value: window.innerWidth <= this.CONST.MOBILE_WIDTH })
    }
  },
  mounted () {
    window.addEventListener('resize', this._.debounce(this.onSize, 300))
    this.onSize()
  }
}
</script>

<style>
  @import "assets/app.css";
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');
  @import url('https://fonts.googleapis.com/css?family=Lato:400,700,900');

  #app {
    font-family: Lato, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin: 0;
    overflow: hidden;
    min-width: 1024px;
    min-height: 768px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
