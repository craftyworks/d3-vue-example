<template>
  <div id="app">
    <d3-v4></d3-v4>
  </div>
</template>

<script>
import D3V4 from './components/D3V4'
export default {
  name: 'App',
  components: {
    D3V4
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
  }
</style>
