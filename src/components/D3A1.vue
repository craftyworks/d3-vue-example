<template>
  <div id='infovizDiv'>
    <svg>
      <path :d="path1" style="fill: none"></path>
      <path :d="path1" transform="translate(0,100)"></path>
      <path :d="path2" transform="translate(0,200)"></path>
      <polygon :points="points"></polygon>
      <g>
        <line x1="200" y1="100" x2="450" y2="225" style="stroke:black; stroke-width: 2px;"></line>
        <circle @click="click" cy="100" cx="200" r="30" style="fill: #4774c3;"></circle>
        <rect x="400" y="200" width="100" height="50" style="fill: deeppink; stroke:#42b983; stroke-width:4px"></rect>
      </g>
      <g>
        <circle r="2"/>
        <text>This circle's label</text>
      </g>
      <g transform="translate(100,50)">
        <circle r="2"/>
        <text>This circle's label</text>
      </g>
      <g id="g3" transform="translate(100,400) scale(3.5)">
        <circle r="2"/>
        <text>This circle's label</text>
      </g>
    </svg>
  </div>
</template>

<script>

export default {
  name: 'D3_1',
  data () {
    return {
      path1: 'M 10,60 40,30 50,50 60,30 70,80',
      points: '80,400 120,400 160,440 120,480 60,460',
      path2: 'M 10,60 40,30 50,50 60,30 70,80' + 'Z'
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    click (e) {
      console.log(e)
      this.d3.select(e.target).style('fill', 'red')
    }
  }
}
</script>

<style scoped>
  svg {
    width: 500px;
    height: 500px;
    border: 1px solid lightgray;
  }

  svg > path {
    fill: gray;
    stroke: orange;
    stroke-width: 4px
  }

  svg > polygon {
    fill: cyan;
  }

  circle:hover {
    fill: red;
  }
</style>
