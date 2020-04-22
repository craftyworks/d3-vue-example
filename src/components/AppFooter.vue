<template>
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
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
  div.legend-div > div.step {
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
