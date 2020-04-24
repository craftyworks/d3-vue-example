<template>
  <!-- The Modal -->
  <div v-show="mouse.stockCode" class="modal" :style="modalStyle">
    <div class="modal-header">
      <p>{{stockInfo.sector}}</p>
    </div>
    <!-- Modal content -->
    <div class="modal-content" ref="stockModal" :style="{background: stockInfo.color}">
      <div class="stock-name">
        <h3 :style="stockNameStyle">{{stockInfo.name}}</h3>
        <h5>{{stockInfo.code}}</h5>
        <spark-line :width="85" :height="20" color="white" style="left: 60px; top: 53px; position:absolute;"
                    :data="stockInfo.timeline"></spark-line>
      </div>
      <div class="stock-price">
        <h3>{{formatNumber(stockInfo.price)}}</h3>
      </div>
      <div class="stock-change">
        <h3>
          {{(stockInfo.change >= 0 ? '+' : '') + formatFloat(stockInfo.change)}}%
        </h3>
      </div>
    </div>
    <div class="modal-body">
      <div v-for="item in stockInfo.friends" :key="item.code" class="modal-friends">
        <div class="stock-name">
          <p>{{item.name}}</p>
        </div>
        <spark-line :width="80" :height="20" color="#414554" stroke-width="1" :data="item.timeline"></spark-line>
        <div class="stock-price">
          <p>{{formatNumber(item.price)}}</p>
        </div>
        <div class="stock-change">
          <p :style="{color: item.color}">
            {{(item.change >= 0 ? '+' : '') + formatFloat(item.change)}}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SparkLine from './SparkLine'

export default {
  name: 'StockModal',
  components: { SparkLine },
  props: {
    mouse: {
      default: { left: 0, top: 0, stockCode: null }
    },
    stockInfo: {}
  },
  computed: {
    modalStyle () {
      const mw = 300
      let left = this.mouse.left + 50
      if (left > this.window.width - mw - 20) {
        left = this.mouse.left - mw - 50
      }

      let top = this.mouse.top
      const mh = (this.$refs && this.$refs.stockModel) ? this.$refs.stockModal.clientHeight : 200

      if (top > this.window.height - mh - 70) {
        top = this.window.height - mh - 70
      }
      return { left: `${left}px`, top: `${top}px` }
    },
    stockNameStyle () {
      return this.stockInfo.name && this.stockInfo.name.length > 6 ? { fontSize: '16px', margin: '7px 5px' } : {}
    }
  },
  watch: {
    stockInfo () {
      console.log('stockInfo', this.stockInfo)
      this.stockInfo.timeline = this.d3.range(20).map(d => Math.random() - 0.5)
      this.stockInfo.friends && this.stockInfo.friends.forEach(el => {
        el.timeline = this.d3.range(20).map(d => Math.random() - 0.5)
      })
    }
  }
}
</script>

<style scoped>

  /* The Modal (background) */
  .modal {
    /*display: none; !* Hidden by default *!*/
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    width: 300px; /* Full width */
    /*height: 400px; !* Full height *!*/
    /*overflow: auto; !* Enable scroll if needed *!*/
    /*background-color: rgb(0,0,0); !* Fallback color *!*/
    /*background-color: rgba(0,0,0,0.4); !* Black w/ opacity *!*/
  }

  .modal-header {
    color: white;
    background-color: #262931;
    border: 2px solid #262931;
  }

  .modal-header > p {
    font-weight: 700;
    font-size: 12px;
    margin: 0px 10px;
    text-align: left;
    text-shadow: 1px 1px 2px #262931;
  }

  .modal-content {
    color: white;
    padding: 0px;
    border: 2px solid #262931;
    display: flex;
    text-shadow: 1px 1px 2px #262931;
  }

  .modal-body {
    border-width: 0px 2px 2px;
    border-style: solid;
    border-color: #262931;
  }

  .stock-name > h3, .stock-name > h5, .stock-price > h3, .stock-change > h3 {
    margin: 5px 5px;
  }

  .stock-name > h3, .stock-name > h5 {
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stock-name > h3 {
    font-size: 20px;
  }

  .stock-name > h5 {
    font-size: 12px;
    padding: 0px 5px;
  }

  .stock-price {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  .stock-change {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .stock-price > h3, .stock-change > h3 {
    font-size: 18px;
  }

  .modal-friends {
    color: black;
    background-color: white;
    padding: 0px;
    border: 1px solid #262931;
    display: flex;
  }

  .modal-friends p {
    margin: 5px 5px;
    font-size: 12px;
    font-weight: 700;
  }

  .modal-friends svg {
    margin: 4px 0px 0px auto;
  }

  .modal-friends > .stock-price {
    justify-content: flex-end;
    margin-left: 0px;
    min-width: 60px;
  }

  .modal-friends > .stock-change {
    min-width: 50px;
  }
</style>
