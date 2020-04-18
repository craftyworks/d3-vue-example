<template>
  <div id="d3">
    <svg width="500" height="500">
    </svg>
  </div>
</template>

<script>
export default {
  name: 'D3V3',
  data () {
    return {
      cities: [],
      tweets: []
    }
  },
  async mounted () {
    await this.fetchData()
    const y = this.d3.scaleLinear()
      .domain([0, this.d3.max(this.tweets, el => el.count)])
      .range([0, 100])

    this.d3.select('svg')
      .selectAll('rect')
      .data(this.tweets)
      .enter()
      .append('rect')
      .attr('width', 10)
      .attr('height', d => y(d.count))
      .attr('x', (d, i) => i * 60)
      .attr('y', d => 100 - y(d.count))
      .transition()
      .style('fill', 'lightblue')
      .style('stroke', 'red')
      .style('stroke-width', '1px')
      .style('opacity', 0.25)
  },
  methods: {
    async fetchData () {
      await this.d3.json('tweets.json').then(data => {
        const nested = this.d3.nest().key(el => el.user).entries(data.tweets)
        this.tweets = nested.map(el => ({
          key: el.key,
          count: el.values.length
        }))
      })
      console.log(this.tweetsj)
    }
  }
}
</script>

<style scoped>

</style>
