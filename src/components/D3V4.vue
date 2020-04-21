<template>
  <div style="width: 100%; height: 100%; display: flex; flex-direction: column">
    <svg style="flex: 1">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.5"/>
        </filter>
      </defs>
      <g v-for="sect in sectorData" :key="sect.key" :transform="`translate(${sect.x0}, ${sect.y0})`">
        <rect x="1" y="1" :width="sect.width" :height="sect.height" class="sector-box"></rect>
        <template v-if="true">
          <g v-for="item in sect.children" :key="item.code" :transform="`translate(${item.x0}, ${item.y0})`">
            <rect x="0" y="0" :width="item.width" :height="item.height" class="stock-box" :class="[item.rank]"></rect>
            <text :x="item.width/2" :y="item.height/2 - (item.showChange ? item.fontSize/2 : 0)"
                  class="stock-title-text"
                  :style="{fontSize:item.fontSize+'px'}">
              <tspan v-if="item.showName">{{item.name}}</tspan>
              <tspan v-if="item.showChange" :x="item.width/2" :dy="item.fontSize + 5">{{item.change >= 0 ? '+' : ''}}
                {{item.change}}%
              </tspan>
            </text>
          </g>
        </template>
        <polygon :points="`1,1 ${sect.width+1},1 ${sect.width+1},20 20,20 15,25 10,20, 1,20`" class="sector-box-title"
                 :class="[sect.rank]"></polygon>
        <line :x1="sect.width" :y1="1" :x2="sect.width" y2="20" class="sector-box-title-right"></line>
        <text :x="sect.width/2" :y="14" dy="0" class="sector-box-title-text">{{sect.key}}</text>
      </g>
    </svg>
    <div style="display: flex; margin: 0px 10px 10px">
      <div style="flex: auto"></div>
      <div class="legend-div" style="display: flex; flex: none; margin-left: auto;">
        <div class="step" style="background: rgb(246, 53, 56); ">
          -3%
        </div>
        <div class="step" style="background: rgb(191, 64, 69); ">
          -2%
        </div>
        <div class="step" style="background: rgb(139, 68, 78); ">
          -1%
        </div>
        <div class="step" style="background: rgb(65, 69, 84); ">
          0%
        </div>
        <div class="step" style="background: rgb(53, 118, 78); ">
          +1%
        </div>
        <div class="step" style="background: rgb(47, 158, 79); ">
          +2%
        </div>
        <div class="step" style="background: rgb(48, 204, 90); ">
          +3%
        </div>
      </div>
    </div>
    <!-- The Modal -->
    <div v-show="showModal" id="myModal" class="modal">
      <!-- Modal content -->
      <div class="modal-content">
        <span class="close">&times;</span>
        <p>Some text in the Modal..</p>
      </div>
    </div>
  </div>
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
      screenHeight: 0,
      showModal: false
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
      const textWidth = (item.change + '').length * item.fontSize + 5
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
    },
    onMouseOver (e) {
      this.showModal = true
    },
    onMouseOut (e) {
      this.showModal = false
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
      d.children = squarify(d.values, {
        x0: 1,
        y0: 20,
        x1: d.x1 - d.x0,
        y1: d.y1 - d.y0
      })
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

    const vm = this
    allChild.forEach(function (e) {
      e.width = e.x1 - e.x0
      e.height = e.y1 - e.y0
      e.fontSize = fontScale(e.width + e.height)
      e.showName = vm.showName(e)
      e.showChange = e.showName && vm.showChange(e)
      while (e.fontSize > 8 && !e.showName) {
        e.fontSize *= 0.9
        e.showName = vm.showName(e)
        e.showChange = e.showName && vm.showChange(e)
      }
    })

    console.log(this.sectorData)
    setTimeout(() => {
      document.querySelectorAll('rect.stock-box')
        .forEach(el => {
          // el.addEventListener('mouseover', this.onMouseOver)
          // el.addEventListener('mouseout', this.onMouseOut)
        })
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
    font-size: 120%
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

  /* Non IE style */
  @supports not (-ms-high-contrast: none) {
    .stock-title-text, .sector-box-title-text {
      filter: url(#shadow);
    }
  }

  div.step {
    font-size: 11px;
    line-height: 24px;
    font-weight: 400;
    color: white;
    text-shadow: 0 1px 0 rgba(0, 0, 0, .25);
    width: 40px;
    padding-left: 6px;
    padding-right: 6px;
  }
</style>
