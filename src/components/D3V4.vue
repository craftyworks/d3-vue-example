<template>
  <svg>
    <defs>
      <filter id="shadow">
        <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.2"/>
      </filter>
    </defs>
    <g v-for="sect in sectorData" :key="sect.key" :transform="`translate(${sect.x0}, ${sect.y0})`">
      <rect x="0" y="0" :width="sect.width" :height="sect.height" class="sector-box"></rect>
      <rect x="0" y="0" :width="sect.width" height="20px" class="sector-box-title" :class="[sect.rank]"></rect>
      <text :x="sect.width/2" :y="0" dy="4" class="sector-box-title-text">{{sect.key}}</text>

      <g v-for="item in sect.children" :key="item.code" :transform="`translate(${item.x0}, ${item.y0})`">
        <rect x="0" y="0" :width="item.width" :height="item.height" :class="[item.rank]"></rect>
        <text v-if="showText(item)" :x="item.width/2" :y="(item.height - item.fontSize) / 2" class="showbox-title-text"
              filter="url(#shadow)"
              :style="{fontSize:item.fontSize}">
          <tspan>{{item.name}}</tspan>
          <tspan :x="item.width/2" :dy="item.fontSize + 5">{{item.change >= 0 ? '+' : ''}} {{item.change}}%</tspan>
        </text>
      </g>
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
      // await this.$http.get('http://localhost:10080/api/index/kospi200/treeModel')
      await this.$http.get('https://mondrianlab.com/api/index/kospi200/treeModel')
        .then(result => {
          console.log('axios result', result.data)
          this.kospi200 = this.d3.nest().key(d => d.sector).entries(result.data)
          this.kospi200.forEach(d => {
            d.value = d.values.map(el => el.value).reduce((a, b) => a + b)
          })
          this.kospi200.sort((a, b) => b.value - a.value)
        })
    }
  },
  async mounted () {
    const svg = this.d3.select('svg').style('width', '100%').node()
    this.screenWidth = parseFloat(svg.clientWidth || svg.parentNode.clientWidth)
    this.screenHeight = parseFloat(svg.clientHeight || svg.parentNode.clientHeight)

    await this.fetchData()

    this.sectorData = squarify(this.kospi200, this.container)
    this.sectorData.forEach(d => {
      d.width = d.x1 - d.x0
      d.height = d.y1 - d.y0
      d.children = squarify(d.values, { x0: 1, y0: 20, x1: d.x1 - d.x0, y1: d.y1 - d.y0 })
      d.rank = d.children[0].rank
      delete d.values
    })

    const allChild = this.sectorData.flatMap(e => e.children)
    const fontScale = this.d3.scaleLinear()
      .domain([
        this.d3.min(allChild, e => e.x1 - e.x0 + e.y1 - e.y0),
        this.d3.max(allChild, e => e.x1 - e.x0 + e.y1 - e.y0)
      ])
      .range([8, 40])

    allChild.forEach(function (e) {
      e.width = e.x1 - e.x0
      e.height = e.y1 - e.y0
      e.fontSize = fontScale(e.width + e.height)
    })

    console.log(this.sectorData)
  }
}
</script>

<style scoped>
  svg {
    width: 100%;
    height: 100%;
    margin: 10px;
  }

  .sector-box {
    fill: none;
    stroke: #262931;
    stroke-width: 2px;
  }

  .sector-box-title {
    stroke: #262931;
    stroke-width: 2px;
  }

  .sector-box-title-text {
    fill: white;
    font-weight: 700;
    font-size: small;
    text-anchor: middle;
    dominant-baseline: hanging;
  }
</style>
