<template>
  <div id="borderDiv"></div>
</template>

<script>
export default {
  name: 'D3V2',
  data () {
    return {
      someNumbers: [17, 82, 9, 500, 40],
      someColors: ['blue', 'red', 'chartreuse', 'orange'],
      someData: ['filler', 'filler', 'filler', 'filler']
    }
  },
  mounted () {
    this.d3.select('#borderDiv')
      .data(this.someNumbers.filter(el => el <= 40))
      .enter()
      .append('div')
      .html((d) => d)
  }
}
</script>

<style scoped>
  #borderDiv {
    width: 200px;
    height: 50px;
    border: 1px solid gray;
  }
</style>
