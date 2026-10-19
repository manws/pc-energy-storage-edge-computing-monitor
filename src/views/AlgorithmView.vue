<template>
  <StageFrame>
    <div id="stage" class="page stage">
      <header class="top-bar">
        <div class="tb-left">
          <button class="back" type="button" @click="go('/cluster/' + estimate.clusterId)">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                fill="#A1A1AA"
                transform="matrix(1 0 0 1 6 4)"
                d="M-0.7071 4.7071L3.2929 8.7071Q3.5808 9.0121 4 9Q4.4192 9.0121 4.7071 8.7071Q5.0121 8.4192 5 8Q5.0121 7.5808 4.7071 7.2929L1.4142 4L4.7071 0.7071Q5.0121 0.4192 5 0Q5.0121 -0.4192 4.7071 -0.7071Q4.4192 -1.0121 4 -1Q3.5808 -1.0121 3.2929 -0.7071L-0.7071 3.2929Q-1.0121 3.5808 -1 4Q-1.0121 4.4192 -0.7071 4.7071Z"
              />
            </svg>
            <span>返回</span>
          </button>
          <h1 class="page-title">{{ clusterName }} · {{ packName }} · 算法估算</h1>
        </div>
      </header>

      <div class="divider"></div>

      <main class="content">
        <section class="param-row">
          <div class="param-card">
            <div class="param-label">SOE · 能量估算</div>
            <div class="dual">
              <div class="pair">
                <span class="pair-k">真实值</span>
                <span class="pair-v num-blue">{{ estimate.soe.actual.toFixed(1) }}</span>
                <span class="param-unit">kWh</span>
              </div>
              <span class="pair-split"></span>
              <div class="pair">
                <span class="pair-k">预测值</span>
                <span class="pair-v num-blue">{{ estimate.soe.predict.toFixed(1) }}</span>
                <span class="param-unit">kWh</span>
              </div>
            </div>
          </div>
          <div class="param-card">
            <div class="param-label">SOP · 放电功率</div>
            <div class="dual">
              <div class="pair">
                <span class="pair-k">真实值</span>
                <span class="pair-v num-amber">{{ estimate.sopDischarge.actual.toFixed(1) }}</span>
                <span class="param-unit">kW</span>
              </div>
              <span class="pair-split"></span>
              <div class="pair">
                <span class="pair-k">预测值</span>
                <span class="pair-v num-amber">{{ estimate.sopDischarge.predict.toFixed(1) }}</span>
                <span class="param-unit">kW</span>
              </div>
            </div>
          </div>
          <div class="param-card">
            <div class="param-label">SOP · 充电功率</div>
            <div class="dual">
              <div class="pair">
                <span class="pair-k">真实值</span>
                <span class="pair-v num-green">{{ estimate.sopCharge.actual.toFixed(1) }}</span>
                <span class="param-unit">kW</span>
              </div>
              <span class="pair-split"></span>
              <div class="pair">
                <span class="pair-k">预测值</span>
                <span class="pair-v num-green">{{ estimate.sopCharge.predict.toFixed(1) }}</span>
                <span class="param-unit">kW</span>
              </div>
            </div>
          </div>
          <div class="param-card">
            <div class="param-label">SOC · 荷电状态</div>
            <div class="dual">
              <div class="pair">
                <span class="pair-k">真实值</span>
                <span class="pair-v num-cyan">{{ estimate.soc.actual.toFixed(1) }}</span>
                <span class="param-unit">%</span>
              </div>
              <span class="pair-split"></span>
              <div class="pair">
                <span class="pair-k">预测值</span>
                <span class="pair-v num-cyan">{{ estimate.soc.predict.toFixed(1) }}</span>
                <span class="param-unit">%</span>
              </div>
            </div>
          </div>
          <div class="param-card">
            <div class="param-label">SOH · 健康状态</div>
            <div class="dual">
              <div class="pair">
                <span class="pair-k">真实值</span>
                <span class="pair-v num-violet">{{ estimate.soh.actual.toFixed(1) }}</span>
                <span class="param-unit">%</span>
              </div>
              <span class="pair-split"></span>
              <div class="pair">
                <span class="pair-k">预测值</span>
                <span class="pair-v num-violet">{{ estimate.soh.predict.toFixed(1) }}</span>
                <span class="param-unit">%</span>
              </div>
            </div>
          </div>
        </section>

        <section class="card card-soc">
          <div class="card-head">
            <div class="card-title">SOC 估算 · 52 单体</div>
            <div class="card-note">单体序号 = SOC</div>
          </div>
          <div class="soc-grid">
            <span v-for="cell in estimate.cells" :key="cell.index" class="soc-lab">
              单体{{ String(cell.index).padStart(2, '0') }}={{ Number(cell.soc).toFixed(1) }}%
            </span>
          </div>
        </section>

        <section class="chart-row">
          <article class="card card-chart">
            <header class="card-head">
              <div class="head-copy">
                <div class="card-title">OCV-预测曲线</div>
                <div class="card-note">横轴 容量 Q · 纵轴 电压 V</div>
              </div>
              <div class="head-side">
                <div class="legend">
                  <span class="lg"><i class="dot blue"></i>真实值</span>
                  <span class="lg"><i class="dot amber"></i>预测值</span>
                </div>
                <span class="metric">评价指标 = {{ estimate.ocv.score.toFixed(2) }}%</span>
              </div>
            </header>
            <div class="chart">
              <TrendChart :categories="estimate.ocv.categories" :series="ocvSeries" />
            </div>
          </article>

          <article class="card card-chart">
            <header class="card-head">
              <div class="head-copy">
                <div class="card-title">容量轨迹预测</div>
                <div class="card-note">横轴 未来循环次数 · 纵轴 容量 (Ah)</div>
              </div>
              <div class="head-side">
                <div class="legend">
                  <span class="lg"><i class="dot blue"></i>真实值</span>
                  <span class="lg"><i class="dot amber"></i>预测值</span>
                </div>
                <span class="metric">MAPE = {{ estimate.capacity.mape.toFixed(2) }}%</span>
              </div>
            </header>
            <div class="chart">
              <TrendChart :categories="estimate.capacity.categories" :series="capacitySeries" />
            </div>
          </article>
        </section>

        <section class="bottom-row">
          <article class="card card-incons">
            <div class="card-head">
              <div class="card-title">不一致性（单体）· 52 单体</div>
              <div class="card-note warn-note">
                异常 {{ voltageAbnormalCount }} · 绿正常 / 黄异常
              </div>
            </div>
            <div class="chart">
              <CellGridChart :flags="voltageFlags" :cols="13" />
            </div>
          </article>

          <article class="card card-incons">
            <div class="card-head">
              <div class="card-title">不一致性（温度）· 52 单体</div>
              <div class="card-note warn-note">
                异常 {{ temperatureAbnormalCount }} · 绿正常 / 黄异常
              </div>
            </div>
            <div class="chart">
              <CellGridChart :flags="temperatureFlags" :cols="13" />
            </div>
          </article>

          <article class="card card-warn">
            <div class="card-title">预警估算</div>
            <div class="table">
              <div class="thead">
                <span class="col-idx">序号</span>
                <span class="col-name">故障名称</span>
                <span class="col-time">故障时间</span>
              </div>
              <div v-for="(item, index) in estimate.warnings" :key="item.name" class="trow">
                <span class="idx col-idx">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="name col-name" :class="'name-' + item.level">{{ item.name }}</span>
                <span class="time col-time">{{ item.time }}</span>
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  </StageFrame>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StageFrame from '@/components/StageFrame.vue'
import TrendChart from '@/components/charts/TrendChart.vue'
import CellGridChart from '@/components/charts/CellGridChart.vue'
import { getPackEstimate } from '@/mock/cluster'

const route = useRoute()
const router = useRouter()
const estimate = computed(() => getPackEstimate(route.params.clusterId, route.params.packId))
const clusterName = computed(() => `${estimate.value.clusterId}簇`)
const packName = computed(() => `PACK${estimate.value.packId}`)
const voltageFlags = computed(() => estimate.value.cells.map((cell) => cell.voltageAbnormal))
const temperatureFlags = computed(() =>
  estimate.value.cells.map((cell) => cell.temperatureAbnormal)
)
const voltageAbnormalCount = computed(() => voltageFlags.value.filter(Boolean).length)
const temperatureAbnormalCount = computed(() => temperatureFlags.value.filter(Boolean).length)
const ocvSeries = computed(() => [
  { name: '真实值', color: '#29b6f6', data: estimate.value.ocv.actual },
  { name: '预测值', color: '#f59e0b', data: estimate.value.ocv.predict }
])
const capacitySeries = computed(() => [
  { name: '真实值', color: '#29b6f6', data: estimate.value.capacity.actual },
  { name: '预测值', color: '#f59e0b', data: estimate.value.capacity.predict }
])

function go(path) {
  if (router.currentRoute.value.path !== path) {
    router.push(path)
  }
}
</script>

<style scoped>
.page {
  --bg: #0f1d38;
  --card: #18294d;
  --card-2: #243b66;
  --border: #2a3f68;
  --text: #fafafa;
  --muted: #a1a1aa;
  --dim: #71717a;
  --blue: #29b6f6;
  --amber: #f59e0b;
  --green: #4caf50;
  --cyan: #2dd4bf;
  --violet: #a78bfa;
  --red: #ff5252;
  --yellow: #f2c94c;
  --font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.stage {
  width: 100%;
  height: 100%;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 56px;
  flex-shrink: 0;
  background: var(--card);
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tb-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px 6px 8px;
  border: none;
  border-radius: 8px;
  background: var(--card-2);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  color: var(--muted);
  cursor: pointer;
}

.back:hover {
  background: #2c4675;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--text);
}

.divider {
  height: 1px;
  flex-shrink: 0;
  background: var(--border);
}

.content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px 20px 16px;
}

.param-row {
  height: 72px;
  flex-shrink: 0;
  display: flex;
  gap: 10px;
}

.param-card {
  flex: 1;
  min-width: 0;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.param-label {
  font-size: 13px;
  color: var(--muted);
  white-space: nowrap;
}

.dual {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pair {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  white-space: nowrap;
}

.pair-k {
  font-size: 12px;
  color: var(--dim);
}

.pair-v {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.pair-split {
  width: 1px;
  height: 18px;
  background: var(--border);
}

.param-unit {
  font-size: 12px;
  color: var(--muted);
}

.num-blue {
  color: var(--blue);
}
.num-amber {
  color: var(--amber);
}
.num-green {
  color: var(--green);
}
.num-cyan {
  color: var(--cyan);
}
.num-violet {
  color: var(--violet);
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  gap: 8px;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;
}

.head-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.head-side {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}

.card-note {
  font-size: 11px;
  color: var(--dim);
}

.card-note.warn-note {
  color: var(--yellow);
}

.card-soc {
  flex: 0 0 auto;
  min-height: 132px;
}

.soc-grid {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 4px 6px;
  overflow: hidden;
}

.soc-lab {
  height: 20px;
  padding: 0 6px;
  border-radius: 4px;
  background: var(--card-2);
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 20px;
  color: var(--text);
  white-space: nowrap;
}

.chart-row {
  flex: 1.15;
  min-height: 200px;
  display: flex;
  gap: 12px;
}

.card-chart {
  flex: 1;
  min-width: 0;
}

.legend {
  display: flex;
  gap: 10px;
}

.lg {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--muted);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
}

.dot.blue {
  background: var(--blue);
}
.dot.amber {
  background: var(--amber);
}

.metric {
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(41, 182, 246, 0.12);
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--blue);
  white-space: nowrap;
}

.chart {
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: 6px;
  overflow: hidden;
}

.bottom-row {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 12px;
}

.card-incons,
.card-warn {
  flex: 1;
  min-width: 0;
}

.table {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.thead,
.trow {
  display: flex;
  align-items: center;
  gap: 6px;
}

.thead {
  background: var(--card-2);
  border-radius: 6px;
  padding: 6px 8px;
  flex-shrink: 0;
}

.thead span {
  font-size: 11px;
  font-weight: 500;
  color: var(--muted);
}

.trow {
  flex: 1;
  padding: 0 8px;
  min-height: 0;
}

.col-idx {
  width: 32px;
  flex-shrink: 0;
}
.col-name {
  flex: 1;
  min-width: 0;
}
.col-time {
  width: 92px;
  flex-shrink: 0;
  text-align: right;
}

.idx {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--dim);
}

.name {
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.name-critical {
  color: var(--red);
}
.name-warning {
  color: var(--yellow);
}
.name-normal {
  color: #e4e4e7;
}

.time {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
}
</style>
