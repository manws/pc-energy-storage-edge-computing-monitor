import * as echarts from 'echarts/core'
import { BarChart, GaugeChart, HeatmapChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  BarChart,
  GaugeChart,
  HeatmapChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer
])

export default echarts
