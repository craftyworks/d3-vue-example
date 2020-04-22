<template>
  <div style="display: flex; margin: 0px 10px 10px">
    <div style="flex: auto"></div>
    <div class="legend-div" style="display: flex; flex: none; margin-left: auto;">
      <div v-for="step in stepsFilter" :key="step.c" class="step" :style="{background: step.c}">{{step.v}}%</div>
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
    text-shadow: 1px 1px 2px #262931;
    width: 40px;
    padding-left: 6px;
    padding-right: 6px;
  }
</style>
