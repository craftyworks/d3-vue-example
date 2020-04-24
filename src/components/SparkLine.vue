<template>
  <svg ref="svg"></svg>
</template>

<script>
export default {
  name: 'SparkLine',
  props: {
    width: {
      default: 90
    },
    height: {
      default: 24
    },
    type: {
      default: 'line'
    },
    color: {
      type: [Array, String],
      default: () => ['#30CC5A', '#F63538']
    },
    strokeWidth: {
      default: 2
    },
    data: {
      type: Array
    }
  },
  computed: {
    color1 () {
      return Array.isArray(this.color) ? this.color[0] : this.color
    },
    color2 () {
      return Array.isArray(this.color) ? this.color[1] : this.color
    }
  },
  methods: {
    drawBar (svg) {
      const count = this.data.length
      const barWidth = (this.width - count) / count + 1

      svg.selectAll('.spark-bar')
        .data(this.data)
        .enter()
        .append('rect')
        .attr('class', 'spark-bar')
        .attr('x', (d, i) => this.x(i))
        .attr('y', d => d > 0 ? this.y(d) : this.y(0))
        .attr('width', barWidth)
        .attr('height', d => Math.abs(this.y(d) - this.y(0)))
        .attr('fill', d => d > 0 ? this.color1 : this.color2)
    },
    drawLine (svg) {
      const line = this.d3.line()
        .curve(this.d3.curveBasis)
        .x((d, i) => this.x(i))
        .y(d => this.y(d))

      svg.append('path').datum(this.data)
        .attr('class', 'spark-line')
        .attr('fill', 'none')
        .attr('stroke', this.color1)
        .attr('stroke-width', this.strokeWidth)
        .attr('d', line)
    },
    drawSpark () {
      if (!Array.isArray(this.data)) {
        return
      }

      let svg = this.d3.select(this.$refs.svg)
        .attr('width', this.width)
        .attr('height', this.height)

      svg.select('g').remove()
      svg = svg.append('g')
        .attr('transform', 'translate(0, 0)')

      this.x = this.d3.scaleLinear()
        .domain([0, this.data.length])
        .range([0, this.width])

      this.y = this.d3.scaleLinear()
        .domain(this.d3.extent(this.data, d => d))
        .range([this.height, 0])

      if (this.type === 'bar') {
        this.drawBar(svg)
      } else {
        this.drawLine(svg)
      }
    }
  },
  mounted () {
    this.drawSpark()
  },
  watch: {
    data () {
      this.drawSpark()
    }
  }
}
</script>

<style scoped>
</style>
