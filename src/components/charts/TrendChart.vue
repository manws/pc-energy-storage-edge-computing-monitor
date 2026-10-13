<template>
  <div ref="el" class="echart"></div>
</template>

<script setup>
import { computed } from 'vue'
import { useEChart } from './useEChart'

const props = defineProps({
  categories: { type: Array, required: true },
  series: { type: Array, required: true }
})

const tooltip = {
  trigger: 'axis',
  backgroundColor: '#18294d',
  borderColor: '#2a3f68',
  textStyle: { color: '#fafafa', fontSize: 12 }
}

const option = computed(() => ({
  animationDuration: 400,
  grid: { left: 42, right: 12, top: 16, bottom: 28 },
  tooltip,
  xAxis: {
    type: 'category',
    data: props.categories,
    boundaryGap: false,
    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.45)' } },
    axisTick: { show: false },
    axisLabel: { color: '#71717a', fontSize: 10, interval: 1 }
  },
  yAxis: {
    type: 'value',
    scale: true,
    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.45)' } },
    axisLabel: { color: '#71717a', fontSize: 10 }
  },
  series: props.series.map((item) => ({
    name: item.name,
    type: 'line',
    smooth: true,
    symbol: 'none',
    data: item.data,
    lineStyle: { width: 2, color: item.color },
    areaStyle: { color: item.color, opacity: 0.12 }
  }))
}))

const el = useEChart(option)
</script>

<style scoped>
.echart {
  position: absolute;
  inset: 0;
}
</style>
