<template>
  <div id="app">
    <component v-bind:is="screenObject"></component>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  computed: {
    screenObject () {
      return () => window.innerWidth > 0 ? import('./components/StockScreen') : ''
    }
  },
  methods: {
    onSize () {
      this.mutate({ name: 'window', value: { width: window.innerWidth, height: window.innerHeight } })
      this.mutate({ name: 'mobileDevice', value: window.innerWidth <= this.CONST.MOBILE_WIDTH })
    }
  },
  mounted () {
    console.log('App mounted')
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
    /*overflow: hidden;*/
    /*min-width: 1024px;*/
    /*min-height: 700px;*/
    /*width: 100%;*/
    /*height: 100%;*/
    display: flex;
    /*position: absolute;*/
    flex-direction: column;
  }
</style>
