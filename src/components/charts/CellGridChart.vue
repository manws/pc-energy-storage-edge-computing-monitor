<template>
  <div ref="el" class="echart"></div>
</template>

<script setup>
import { computed } from 'vue'
import { useEChart } from './useEChart'

const props = defineProps({
  flags: { type: Array, required: true },
  abnormalColor: { type: String, default: '#f2c94c' },
  cols: { type: Number, default: 26 }
})

const option = computed(() => {
  const cols = props.cols
  const rows = Math.ceil(props.flags.length / cols)
  return {
    animationDuration: 300,
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    tooltip: {
      backgroundColor: '#18294d',
      borderColor: '#2a3f68',
      textStyle: { color: '#fafafa', fontSize: 12 },
      formatter(params) {
        const [col, row, flag] = params.data
        const index = row * cols + col + 1
        return `单体 #${index}<br/>${flag ? '异常' : '正常'}`
      }
    },
    xAxis: {
      type: 'category',
      show: false,
      data: Array.from({ length: cols }, (_, index) => index)
    },
    yAxis: {
      type: 'category',
      show: false,
      inverse: true,
      data: Array.from({ length: rows }, (_, index) => index)
    },
    visualMap: {
      show: false,
      type: 'piecewise',
      pieces: [
        { value: 0, color: '#4caf50' },
        { value: 1, color: props.abnormalColor }
      ]
    },
    series: [
      {
        type: 'heatmap',
        data: props.flags.map((flag, index) => [
          index % cols,
          Math.floor(index / cols),
          flag ? 1 : 0
        ]),
        itemStyle: { borderColor: '#0f1d38', borderWidth: 2 },
        emphasis: { disabled: true }
      }
    ]
  }
})

const el = useEChart(option)
</script>

<style scoped>
.echart {
  position: absolute;
  inset: 0;
}
</style>
