<template>
  <div id="app">
    <stock-screen></stock-screen>
    <app-footer></app-footer>
    <stock-modal></stock-modal>
  </div>
</template>

<script>
import AppFooter from './components/AppFooter'
import StockModal from './components/StockModal'
import StockScreen from './components/StockScreen'

export default {
  name: 'App',
  components: {
    StockScreen, StockModal, AppFooter
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
