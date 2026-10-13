import { onMounted, onUnmounted, ref, watch } from 'vue'
import echarts from '@/charts/echarts'

export function useEChart(option) {
  const el = ref(null)
  let chart
  let observer

  function render() {
    if (!chart || !option.value) return
    chart.setOption(option.value, true)
  }

  onMounted(() => {
    chart = echarts.init(el.value)
    render()
    observer = new ResizeObserver(() => chart?.resize())
    observer.observe(el.value)
  })

  watch(option, render)

  onUnmounted(() => {
    observer?.disconnect()
    chart?.dispose()
    chart = undefined
  })

  return el
}
