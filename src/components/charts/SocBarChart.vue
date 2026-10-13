<template>
  <div ref="el" class="echart"></div>
</template>

<script setup>
import { computed } from 'vue'
import { useEChart } from './useEChart'

const props = defineProps({
  values: { type: Array, required: true }
})

function socColor(value) {
  if (value < 70) return '#ff5252'
  if (value < 80) return '#f2c94c'
  return '#4caf50'
}

const option = computed(() => ({
  animationDuration: 400,
  grid: { left: 32, right: 8, top: 8, bottom: 8 },
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#18294d',
    borderColor: '#2a3f68',
    textStyle: { color: '#fafafa', fontSize: 12 },
    formatter(params) {
      const point = params[0]
      return `单体 #${point.dataIndex + 1}<br/>SOC ${point.value} %`
    }
  },
  xAxis: {
    type: 'category',
    show: false,
    data: props.values.map((_, index) => index + 1)
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    splitNumber: 4,
    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.45)' } },
    axisLabel: { color: '#71717a', fontSize: 10 }
  },
  series: [
    {
      type: 'bar',
      data: props.values,
      barWidth: '70%',
      itemStyle: {
        color: (params) => socColor(params.value)
      }
    }
  ]
}))

const el = useEChart(option)
</script>

<style scoped>
.echart {
  position: absolute;
  inset: 0;
}
</style>
