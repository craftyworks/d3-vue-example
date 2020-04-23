<template>
  <!-- The Modal -->
  <div v-show="mouse.stockCode" class="modal" :style="modalStyle">
    <div class="modal-header">
      <p>{{stockInfo.sector}}</p>
    </div>
    <!-- Modal content -->
    <div class="modal-content" ref="stockModal" :style="{background: stockInfo.color}">
      <div class="stock-name">
        <h2>{{stockInfo.name}}</h2>
        <h4>{{stockInfo.code}}</h4>
      </div>
      <div class="stock-price">
        <h2>{{formatNumber(stockInfo.price)}}</h2>
      </div>
      <div class="stock-change">
        <h2>
          {{(stockInfo.change >= 0 ? '+' : '') + formatFloat(stockInfo.change)}}%
        </h2>
      </div>
    </div>
    <div v-for="item in stockInfo.friends" :key="item.code" class="modal-friends">
      <div class="stock-name">
        <h4>{{item.name}}</h4>
      </div>
      <div class="stock-price">
        <h5>{{formatNumber(item.price)}}</h5>
      </div>
      <div class="stock-change">
        <h5 :style="{color: item.color}">
          {{(item.change >= 0 ? '+' : '') + formatFloat(item.change)}}%
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StockModal',
  props: {
    mouse: {
      default: { left: 0, top: 0, stockCode: null }
    },
    stockInfo: {}
  },
  computed: {
    modalStyle () {
      const mw = 400
      let left = this.mouse.left + 100
      if (left > this.window.width - mw - 20) {
        left = this.mouse.left - mw - 100
      }

      let top = this.mouse.top
      const mh = (this.$refs && this.$refs.stockModel) ? this.$refs.stockModal.clientHeight : 200

      if (top > this.window.height - mh - 50) {
        top = this.window.height - mh - 50
      }
      return { left: `${left}px`, top: `${top}px`, border: '1px solid black' }
    }
  },
  methods: {
    formatNumber (num) {
      const fn = this.d3.format(',')
      return fn(num)
    },
    formatFloat (num) {
      const fn = this.d3.format(',.2f')
      return fn(num)
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
    width: 400px; /* Full width */
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
    /*margin: 15% auto; !* 15% from the top and centered *!*/
    padding: 0px;
    border: 2px solid #262931;
    display: flex;
    text-shadow: 1px 1px 2px #262931;
  }

  .stock-name > h2, .stock-name > h4 {
    margin: 5px 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stock-name > h4 {
    text-align: left;
    padding-left: 10px;
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
    margin: 0px 10px;
  }

  .modal-friends {
    color: black;
    background-color: white;
    padding: 0px;
    border: 1px solid #262931;
    display: flex;
  }

  .modal-friends h4 {
    margin: 5px 5px;
  }

  .modal-friends h5 {
    margin: 5px 5px;
  }

  .modal-friends > .stock-change {
    min-width: 60px;
  }
</style>
