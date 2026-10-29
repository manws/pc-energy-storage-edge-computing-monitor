<template>
  <div ref="el" class="echart"></div>
</template>

<script setup>
import { computed } from 'vue'
import { useEChart } from './useEChart'

const props = defineProps({
  categories: { type: Array, default: () => [] },
  series: { type: Array, required: true },
  showXAxis: { type: Boolean, default: true }
})

const tooltip = {
  trigger: 'axis',
  backgroundColor: '#18294d',
  borderColor: '#2a3f68',
  textStyle: { color: '#fafafa', fontSize: 12 }
}

const option = computed(() => {
  const valueAxis = Array.isArray(props.series[0]?.data?.[0])
  const categories = props.categories.length
    ? props.categories
    : (props.series[0]?.data || []).map((_, index) => String(index))
  return {
    animation: true,
    animationDuration: 600,
    animationDurationUpdate: 800,
    animationEasingUpdate: 'cubicInOut',
    grid: { left: 42, right: 12, top: 16, bottom: props.showXAxis ? 28 : 12 },
    tooltip,
    xAxis: valueAxis
      ? {
          type: 'value',
          show: props.showXAxis,
          scale: true,
          axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.45)' } },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { color: '#71717a', fontSize: 10, hideOverlap: true }
        }
      : {
          type: 'category',
          show: props.showXAxis,
          data: categories,
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
      animationDurationUpdate: 800,
      lineStyle: { width: 2, color: item.color },
      areaStyle: { color: item.color, opacity: 0.12 }
    }))
  }
})

const el = useEChart(option, { replay: true })
</script>

<style scoped>
.echart {
  position: absolute;
  inset: 0;
}
</style>
