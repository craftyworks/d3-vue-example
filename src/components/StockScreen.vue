<template>
  <svg style="flex: 1">
    <defs>
      <filter id="shadow">
        <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.8"/>
      </filter>
    </defs>
    <g v-for="sect in sectorData" :key="sect.key" :transform="`translate(${sect.x0}, ${sect.y0})`">
      <rect x="1" y="1" :width="sect.width" :height="sect.height" class="sector-box"></rect>
      <g v-for="item in sect.children" :key="item.code" :transform="`translate(${item.x0}, ${item.y0})`">
        <rect x="0" y="0" :width="item.width" :height="item.height"
              class="stock-box"
              :style="{fill: item.color}" :data-stock-code="item.code"></rect>
        <text :x="item.width/2" :y="item.height/2 - (item.showChange ? item.fontSize/2 : 0)"
              class="stock-title-text"
              :style="stockTitleStyle(item)">
          <tspan v-if="item.showName" :data-stock-code="item.code">{{item.name}}</tspan>
          <tspan v-if="item.showChange" :data-stock-code="item.code" :x="item.width/2" :dy="item.fontSize + 5">
            {{(item.change >= 0 ? '+' : '') +
            item.change}}%
          </tspan>
        </text>
      </g>
      <polygon :points="`1,1 ${sect.width+1},1 ${sect.width+1},20 20,20 15,25 10,20, 1,20`" class="sector-box-title"
               :style="{fill: sect.children[0].color}"></polygon>
      <line :x1="sect.width" :y1="1" :x2="sect.width" y2="20" class="sector-box-title-right"></line>
      <text :x="sect.width/2" :y="14" dy="0" class="sector-box-title-text">{{sect.key}}</text>
    </g>
  </svg>
</template>

<script>
import squarify from 'squarify'

export default {
  name: 'D3V4',
  data () {
    return {
      sectorData: [],
      chartData: [],
      screenWidth: 0,
      screenHeight: 0
    }
  },
  computed: {
    container () {
      const margin = 10 * 2
      return {
        x0: 0,
        y0: 0,
        x1: this.screenWidth - margin,
        y1: this.screenHeight - margin
      }
    }
  },
  methods: {
    showName (item) {
      const textWidth = item.name.length * item.fontSize + 5
      const textHeight = item.fontSize * 2 + 10
      return textWidth < item.width && textHeight < item.height
    },

    showChange (item) {
      const textWidth = (item.change + '').length - 1 * item.fontSize
      const textHeight = item.fontSize * 2 + 20
      return textWidth < item.width && textHeight < item.height
    },
    stockTitleStyle (item) {
      return { fontSize: item.fontSize + 'px' }
    },
    async fetchData () {
      let result = await this.$http.get('https://mondrianlab.com/api/index/kospi200/treeModel')
      result = this.d3.nest().key(d => d.sector).entries(result.data)
      result.forEach(d => {
        d.value = d.values.map(el => el.value).reduce((a, b) => a + b)
      })
      return result.sort((a, b) => b.value - a.value)
    },
    onMouseMove (e) {
      const element = document.elementFromPoint(e.x, e.y)
      const stockCode = element.getAttribute('data-stock-code') || element.dataset.stockCode
      console.log('move', stockCode, e.x, e.y)
      this.mutate({ name: 'mouse', value: { left: e.x, top: e.y + 10, stockCode: stockCode } })
    },
    onMouseOut (e) {
      this.mutate({ name: 'mouse', value: { left: e.x, top: e.y + 10, stockCode: null } })
    }
  },
  async mounted () {
    const svg = this.d3.select('svg').style('width', '100%').node()
    this.screenWidth = parseFloat(svg.clientWidth || svg.parentNode.clientWidth)
    this.screenHeight = parseFloat(svg.clientHeight || svg.parentNode.clientHeight)

    const kospi200 = await this.fetchData()
    this.sectorData = squarify(kospi200, this.container)
    this.sectorData.forEach(d => {
      d.width = d.x1 - d.x0
      d.height = d.y1 - d.y0
      d.children = squarify(d.values, {
        x0: 1,
        y0: 20,
        x1: d.x1 - d.x0,
        y1: d.y1 - d.y0
      })
      delete d.values
    })

    const allChild = this.sectorData.flatMap(e => e.children)
    const fontScale = this.d3.scaleLinear()
      .domain([
        this.d3.min(allChild, e => e.x1 - e.x0 + e.y1 - e.y0),
        this.d3.mean(allChild, e => e.x1 - e.x0 + e.y1 - e.y0),
        this.d3.max(allChild, e => e.x1 - e.x0 + e.y1 - e.y0)
      ])
      .range([8, 16, 40])

    const colorScale = this.d3.scaleLinear()
      .domain(this.steps.map(e => e.v))
      .range(this.steps.map(e => e.c))

    const vm = this
    allChild.forEach(function (e) {
      e.width = e.x1 - e.x0
      e.height = e.y1 - e.y0
      e.color = colorScale(e.change)
      e.fontSize = fontScale(e.width + e.height)
      e.showName = vm.showName(e)
      e.showChange = e.showName && vm.showChange(e)
      while (e.fontSize > 8 && !e.showName) {
        e.fontSize *= 0.9
        e.showName = vm.showName(e)
        e.showChange = e.showName && vm.showChange(e)
      }
    })

    setTimeout(() => {
      const el = document.querySelector('svg')
      el.addEventListener('mousemove', this.onMouseMove)
      el.addEventListener('mouseleave', this.onMouseOut)
    }, 1000)
  }
}
</script>

<style scoped>
  svg {
    width: 100%;
    height: 100%;
    margin: 10px 10px 0px 10px;
  }

  .stock-title-text tspan {
    fill: white;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: middle;
    transition: 0.3s;
  }

  .stock-title-text tspan:hover {
    font-size: 120% !important;
  }

  .stock-title-text tspan:nth-child(2) {
    font-size: 90%
  }

  .sector-box {
    fill: transparent;
    stroke: #262931;
    stroke-width: 2px;
  }

  .sector-box-title {
    stroke: #262931;
    stroke-width: 2px;
  }

  .sector-box-title-right {
    stroke: #262931;
    stroke-width: 1px;
  }

  .sector-box-title-text {
    fill: white;
    font-weight: 700;
    font-size: 12px;
    text-anchor: middle;
    /*dominant-baseline: hanging;*/
  }

  .stock-box {
    stroke: #262931;
    stroke-width: 1px;
    transition: 0.3s;
  }

  .stock-box:hover {
    opacity: 0.9;
    fill: #ec008c !important;
  }

  /* Non IE style */
  @supports not (-ms-high-contrast: none) {
    .stock-title-text, .sector-box-title-text {
      filter: url(#shadow);
    }
  }
</style>
