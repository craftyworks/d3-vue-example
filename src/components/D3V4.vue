<template>
  <svg>
    <defs>
      <filter id="shadow">
        <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2"/>
      </filter>
    </defs>
    <g v-for="item in chartData" :key="item.name" :transform="`translate(${item.x0}, ${item.y0})`">
      <rect x="0" y="0" :width="item.width" :height="item.height" :class="[item.rank]"></rect>
      <text v-if="showText(item)" :x="item.width/2" :y="(item.height - item.fontSize) / 2" class="showbox-title-text"
            filter="url(#shadow)"
            :style="{fontSize:item.fontSize}">
        <tspan>{{item.name}}</tspan>
        <tspan :x="item.width/2" :dy="item.fontSize + 5">{{item.change >= 0 ? '+' : '-'}} {{item.change}}%</tspan>
      </text>
    </g>
  </svg>
</template>

<script>
import squarify from 'squarify'

export default {
  name: 'D3V4',
  data () {
    return {
      kospi200: [],
      sectorData: [],
      chartData: [],
      screenWidth: 0,
      screenHeight: 0
    }
  },
  computed: {
    container () {
      const margin = 10 * 2
      return { x0: 0, y0: 0, x1: this.screenWidth - margin, y1: this.screenHeight - margin }
    }
  },
  methods: {
    showText (item) {
      const textWidth = item.name.length * item.fontSize
      const textHeight = item.fontSize * 2 + 10
      return textWidth < item.width && textHeight < item.height
    },
    async fetchData () {
      await this.d3.csv('kospi202.csv', function (d) {
        return {
          code: d.code,
          name: d.name,
          price: +d.price,
          change: +d.change,
          value: +d.cap,
          sector: d.sector,
          rank: `rank-${d.rank.toLowerCase()}`
        }
      }).then(data => {
        this.kospi200 = this.d3.nest().key(d => d.sector).entries(data)
        this.kospi200.forEach(d => {
          d.value = d.values.map(el => el.value).reduce((a, b) => a + b)
          d.children = d.values
          delete d.values
        })
        this.kospi200.sort((a, b) => b.value - a.value)
        console.log(this.kospi200)
      })
    }
  },
  async mounted () {
    const svg = this.d3.select('svg').style('width', '100%').node()
    this.screenWidth = parseFloat(svg.clientWidth || svg.parentNode.clientWidth)
    this.screenHeight = parseFloat(svg.clientHeight || svg.parentNode.clientHeight)

    await this.fetchData()

    this.chartData = squarify(this.kospi200, this.container)

    const fontScale = this.d3.scaleLinear()
      .domain([
        this.d3.min(this.chartData, e => e.x1 - e.x0 + e.y1 - e.y0),
        this.d3.max(this.chartData, e => e.x1 - e.x0 + e.y1 - e.y0)
      ])
      .range([8, 40])

    this.chartData.forEach(function (e) {
      e.width = e.x1 - e.x0
      e.height = e.y1 - e.y0
      e.fontSize = fontScale(e.width + e.height)
    })

    const tspan = this.d3.select('svg').selectAll('tspan')
    console.log(tspan)
  }
}
</script>

<style scoped>
  svg {
    width: 100%;
    height: 100%;
    margin: 10px;
  }
</style>
