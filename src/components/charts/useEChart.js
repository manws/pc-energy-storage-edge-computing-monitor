import { onMounted, onUnmounted, ref, watch } from 'vue'
import echarts from '@/charts/echarts'

export function useEChart(option, { replay = false } = {}) {
  const el = ref(null)
  let chart
  let observer
  let rendered = false

  function render() {
    if (!chart || !option.value) return
    if (replay && rendered) chart.clear()
    chart.setOption(option.value, replay && rendered)
    rendered = true
  }

  onMounted(() => {
    chart = echarts.init(el.value)
    render()
    let width = el.value.clientWidth
    let height = el.value.clientHeight
    observer = new ResizeObserver(() => {
      if (!chart || !el.value) return
      const nextWidth = el.value.clientWidth
      const nextHeight = el.value.clientHeight
      if (nextWidth === width && nextHeight === height) return
      width = nextWidth
      height = nextHeight
      chart.resize()
    })
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
