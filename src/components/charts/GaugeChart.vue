<template>
  <div ref="el" class="echart"></div>
</template>

<script setup>
import { computed } from 'vue'
import { useEChart } from './useEChart'

const props = defineProps({
  value: { type: Number, required: true },
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  color: { type: String, required: true }
})

const option = computed(() => ({
  animationDuration: 400,
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: props.min,
      max: props.max,
      radius: '148%',
      center: ['50%', '86%'],
      pointer: { show: false },
      progress: {
        show: true,
        width: 12,
        roundCap: true,
        itemStyle: { color: props.color }
      },
      axisLine: {
        roundCap: true,
        lineStyle: { width: 12, color: [[1, '#27272A']] }
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: { show: false },
      data: [{ value: props.value }]
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
