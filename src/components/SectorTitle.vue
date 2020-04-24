<template>
  <g v-if="sect.height > 40">
    <polygon :points="`1,1 ${sect.width+1},1 ${sect.width+1},20 20,20 15,25 10,20, 1,20`" class="sector-box-title"
             :style="{fill: sect.children[0].color}"></polygon>
    <line :x1="sect.width" :y1="1" :x2="sect.width" y2="20" class="sector-box-title-right"></line>
    <text :x="sect.width/2" :y="14" dy="0" class="sector-box-title-text">{{sect.key}}</text>
  </g>
</template>

<script>
export default {
  name: 'SectorTitle',
  props: {
    sect: Object
  }
}
</script>

<style scoped>
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
    .sector-box-title-text {
      filter: url(#shadow);
    }
  }
</style>
