<template>
  <div id="app">
    <d3-v2></d3-v2>
  </div>
</template>

<script>
import D3V2 from './components/D3V2'

export default {
  name: 'App',
  components: {
    D3V2
  }
}
</script>

<style>
  @import "assets/app.css";
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
