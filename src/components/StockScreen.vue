<template>
  <div ref="screenDiv" style="flex: auto">
    <svg ref="svg" style="flex: 1">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0.2" dy="0.4" stdDeviation="1.5"/>
        </filter>
      </defs>
      <g v-for="sect in sectorData" :key="sect.key" :transform="`translate(${sect.x0}, ${sect.y0})`">
        <rect x="1" y="1" :width="sect.width" :height="sect.height" class="sector-box"></rect>
        <g v-for="item in sect.children" :key="item.code" :transform="`translate(${item.x0}, ${item.y0})`">
          <rect x="0" y="0" :width="item.width" :height="item.height"
                class="stock-box"
                :class="{active: item.code === mouse.stockCode}"
                :style="{fill: item.color}" :data-stock-code="item.code"></rect>
          <text :x="item.width/2" :y="item.height/2 - (item.showChange ? item.fontSize/2 : 0)"
                class="stock-title-text"
                :class="{active: item.code === mouse.stockCode}"
                :style="{ fontSize: item.fontSize + 'px' }">
            <tspan v-if="item.showName" :data-stock-code="item.code">{{item.name}}</tspan>
            <tspan v-if="item.showChange" :data-stock-code="item.code" :x="item.width/2" :dy="item.fontSize + 5">
              {{(item.change >= 0 ? '+' : '') + item.change}}%
            </tspan>
          </text>
        </g>
        <sector-title :sect="sect"></sector-title>
      </g>
    </svg>
    <stock-modal :mouse="mouse" :stock-info="stockInfo"></stock-modal>
    <stock-screen-footer></stock-screen-footer>
  </div>
</template>

<script>
import squarify from 'squarify'
import StockModal from './StockModal'
import SectorTitle from './SectorTitle'
import StockScreenFooter from './StockScreenFooter'

export default {
  name: 'StockScreen',
  components: { StockScreenFooter, SectorTitle, StockModal },
  data () {
    return {
      sectorData: [],
      screenWidth: 0,
      screenHeight: 0,
      mouse: { left: 0, top: 0, stockCode: null }
    }
  },
  computed: {
    container () {
      return { x0: 0, y0: 0, x1: this.screenWidth, y1: this.screenHeight }
    },
    stockInfo () {
      const stockInfo = this.sectorData.flatMap(e => e.children).filter(e => e.code === this.mouse.stockCode)[0]
      if (stockInfo) {
        stockInfo.friends = this.sectorData.filter(e => e.key === stockInfo.sector)[0].children.filter(e => e.code !== stockInfo.code).slice(0, 5)
      }
      return stockInfo || {}
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
    async fetchData () {
      let result = await this.$http.get('https://mondrianlab.com/api/index/kospi200/treeModel')
      // let result = await this.$http.get('http://localhost:10080/api/index/kospi200/treeModel')
      result = this.d3.nest().key(d => d.sector).entries(result.data)
      result.forEach(d => {
        d.value = d.values.map(el => el.value).reduce((a, b) => a + b)
      })
      return result.sort((a, b) => b.value - a.value)
    },
    onMouseMove (e) {
      const element = document.elementFromPoint(e.x, e.y)
      if (element) {
        const stockCode = element.getAttribute('data-stock-code') || element.dataset.stockCode
        this.mouse = { left: e.x, top: e.y + 10, stockCode: stockCode }
      }
    },
    onMouseOut (e) {
      this.mouse = { left: e.x, top: e.y + 10, stockCode: null }
    },
    initScreen () {
      console.log('init screen')
      const minScreen = this.minimumScreen()
      const width = Math.max(minScreen.width, this.window.width) - 20
      const height = Math.max(minScreen.height, this.window.height) - 20

      console.log('width: %s, height: %s', width, height)

      this.d3.select(this.$refs.screenDiv)
        .style('width', width + 'px')
        .style('height', height + 'px')

      const svg = this.d3.select('svg')
        .style('width', (width - 20) + 'px')
        .style('height', (height - 20 - 40) + 'px')
        .node()
      this.screenWidth = parseFloat(svg.clientWidth || svg.parentNode.clientWidth)
      this.screenHeight = parseFloat(svg.clientHeight || svg.parentNode.clientHeight)
      console.log('svg width: %s, height: %s', this.screenWidth, this.screenHeight)
    }
  },
  async mounted () {
    this.initScreen()

    console.log('container', this.container)

    const kospi200 = await this.fetchData()
    this.sectorData = squarify(kospi200, this.container)
    this.sectorData
      .forEach(d => {
        d.width = d.x1 - d.x0
        d.height = d.y1 - d.y0
        // Sector Box 의 높이가 40px 이 안되면 Sector Title 표시를 생략한다.
        d.children = squarify(d.values, { x0: 1, y0: (d.height > 40 ? 20 : 0), x1: d.width, y1: d.height })
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
    margin: 10px 10px 10px 10px;
  }

  .stock-title-text tspan {
    fill: white;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: middle;
    transition: 0.3s;
  }

  .stock-title-text.active tspan:nth-child(1) {
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

  .stock-box {
    stroke: #262931;
    stroke-width: 1px;
    transition: 0.3s;
  }

  .stock-box.active {
    opacity: 0.9;
    /*fill: #3366FF !important;*/
  }

  /* Non IE style */
  @supports not (-ms-high-contrast: none) {
    .stock-title-text {
      filter: url(#shadow);
    }
  }
</style>
