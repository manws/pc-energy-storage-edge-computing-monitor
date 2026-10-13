<template>
  <StageFrame>
    <div id="stage" class="page stage">
      <!-- 顶栏 -->
      <header class="top-bar">
        <div class="tb-left">
          <button class="back" type="button" @click="go('/cluster/' + detail.clusterId)">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#A1A1AA"
                transform="matrix(1 0 0 1 6 4)"
                d="M-0.7071 4.7071L3.2929 8.7071Q3.5808 9.0121 4 9Q4.4192 9.0121 4.7071 8.7071Q5.0121 8.4192 5 8Q5.0121 7.5808 4.7071 7.2929L1.4142 4L4.7071 0.7071Q5.0121 0.4192 5 0Q5.0121 -0.4192 4.7071 -0.7071Q4.4192 -1.0121 4 -1Q3.5808 -1.0121 3.2929 -0.7071L-0.7071 3.2929Q-1.0121 3.5808 -1 4Q-1.0121 4.4192 -0.7071 4.7071Z"
              />
            </svg>
            <span>返回</span>
          </button>
          <h1 class="title">{{ clusterName }} · {{ packName }} · 查看详情</h1>
        </div>
        <div class="tb-right">
          <span class="status" :class="statusTone">{{ detail.status }}</span>
          <span class="updated">最后更新 {{ detail.updatedAt }}</span>
        </div>
      </header>

      <div class="divider"></div>

      <!-- 内容区 -->
      <main class="content">
        <!-- 仪表盘行 -->
        <section class="gauge-row">
          <article class="gauge-card">
            <h2 class="gauge-label">总电压</h2>
            <div class="gauge-visual">
              <GaugeChart
                :value="detail.voltage.value"
                :min="detail.voltage.min"
                :max="detail.voltage.max"
                :color="detail.voltage.color"
              />
            </div>
            <div class="val">
              <span class="num">{{ detail.voltage.value.toFixed(1) }}</span>
              <span class="unit">{{ detail.voltage.unit }}</span>
            </div>
            <p class="range">量程 {{ detail.voltage.min }} – {{ detail.voltage.max }} V</p>
          </article>

          <article class="gauge-card">
            <h2 class="gauge-label">总电流</h2>
            <div class="gauge-visual">
              <GaugeChart
                :value="detail.current.value"
                :min="detail.current.min"
                :max="detail.current.max"
                :color="detail.current.color"
              />
            </div>
            <div class="val">
              <span class="num">{{ detail.current.value.toFixed(1) }}</span>
              <span class="unit">{{ detail.current.unit }}</span>
            </div>
            <p class="range">量程 {{ detail.current.min }} – {{ detail.current.max }} A</p>
          </article>

          <article class="gauge-card">
            <h2 class="gauge-label">SOC 荷电状态</h2>
            <div class="gauge-visual">
              <GaugeChart
                :value="detail.soc.value"
                :min="detail.soc.min"
                :max="detail.soc.max"
                :color="detail.soc.color"
              />
            </div>
            <div class="val">
              <span class="num accent">{{ detail.soc.value.toFixed(1) }}</span>
              <span class="unit">{{ detail.soc.unit }}</span>
            </div>
            <p class="range">额定容量 {{ detail.soc.capacityAh }} Ah</p>
          </article>
        </section>

        <!-- 曲线图行 -->
        <section class="chart-row">
          <article class="chart-card">
            <header class="card-head">
              <h3 class="card-title">单体极值 · 电压曲线</h3>
              <div class="legend">
                <span class="lg"><i class="dot orange"></i>最高单体</span>
                <span class="lg"><i class="dot cyan"></i>最低单体</span>
              </div>
            </header>
            <div class="chart">
              <TrendChart :categories="detail.cellVoltage.times" :series="voltageSeries" />
            </div>
            <div class="stats">
              <div class="stat">
                <span class="stat-label">最高单体 (#{{ detail.cellVoltage.maxIndex }})</span>
                <span class="stat-value orange">{{ detail.cellVoltage.max.toFixed(3) }} V</span>
              </div>
              <div class="stat">
                <span class="stat-label">最低单体 (#{{ detail.cellVoltage.minIndex }})</span>
                <span class="stat-value cyan">{{ detail.cellVoltage.min.toFixed(3) }} V</span>
              </div>
            </div>
          </article>

          <article class="chart-card">
            <header class="card-head">
              <h3 class="card-title">温度极值 · 温度曲线</h3>
              <div class="legend">
                <span class="lg"><i class="dot red"></i>最高温度</span>
                <span class="lg"><i class="dot green"></i>最低温度</span>
              </div>
            </header>
            <div class="chart">
              <TrendChart :categories="detail.cellTemperature.times" :series="temperatureSeries" />
            </div>
            <div class="stats">
              <div class="stat">
                <span class="stat-label"
                  >最高温度 (#{{ cellNo(detail.cellTemperature.maxIndex) }})</span
                >
                <span class="stat-value red">{{ detail.cellTemperature.max.toFixed(1) }} ℃</span>
              </div>
              <div class="stat">
                <span class="stat-label"
                  >最低温度 (#{{ cellNo(detail.cellTemperature.minIndex) }})</span
                >
                <span class="stat-value green">{{ detail.cellTemperature.min.toFixed(1) }} ℃</span>
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
import GaugeChart from '@/components/charts/GaugeChart.vue'
import TrendChart from '@/components/charts/TrendChart.vue'
import { getPackDetail } from '@/mock/cluster'

const route = useRoute()
const router = useRouter()
const detail = computed(() => getPackDetail(route.params.clusterId, route.params.packId))
const clusterName = computed(() => `${detail.value.clusterId}簇`)
const packName = computed(() => `PACK${detail.value.packId}`)
const statusTone = computed(
  () => ({ 正常: 'ok', 预警: 'warn', 异常: 'error' })[detail.value.status] || 'ok'
)
const voltageSeries = computed(() => [
  { name: '最高单体', color: '#f59e0b', data: detail.value.cellVoltage.maxSeries },
  { name: '最低单体', color: '#22d3ee', data: detail.value.cellVoltage.minSeries }
])
const temperatureSeries = computed(() => [
  { name: '最高温度', color: '#ff5252', data: detail.value.cellTemperature.maxSeries },
  { name: '最低温度', color: '#4caf50', data: detail.value.cellTemperature.minSeries }
])

function cellNo(value) {
  return String(value).padStart(3, '0')
}

function go(path) {
  if (router.currentRoute.value.path !== path) {
    router.push(path)
  }
}
</script>

<style scoped>
.page {
  --bg: #0f1d38;
  --surface: #18294d;
  --surface-raised: #243b66;
  --status-ok-bg: #182c1a;
  --border: #2a3f68;
  --grid: #27272a;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --green: #4caf50;
  --blue: #29b6f6;
  --orange: #f59e0b;
  --cyan: #22d3ee;
  --red: #ff5252;
  --font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

img {
  display: block;
}

.stage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow: hidden;
}

/* ============ 顶栏 ============ */
.top-bar {
  flex: none;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--surface);
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
  background: var(--surface-raised);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s ease;
}
.back:hover {
  background: #2c4675;
}
.back svg {
  flex: none;
}

.title {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--text-primary);
}

.tb-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
}
.status.ok {
  background: var(--status-ok-bg);
  color: var(--green);
}
.status.warn {
  background: #2e2a16;
  color: #f2c94c;
}
.status.error {
  background: #2e1818;
  color: var(--red);
}

.updated {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 17px;
  color: var(--text-muted);
}

/* ============ 分隔线 ============ */
.divider {
  flex: none;
  height: 1px;
  background: var(--border);
}

/* ============ 内容区 ============ */
.content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

/* ---- 仪表盘行 ---- */
.gauge-row {
  flex: none;
  height: clamp(216px, 28vh, 280px);
  display: flex;
  gap: 16px;
}

.gauge-card {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.gauge-label {
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  color: var(--text-secondary);
}

.gauge-visual {
  position: relative;
  width: 160px;
  height: 96px;
}

.val {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.val .num {
  font-family: var(--font-mono);
  font-size: 30px;
  font-weight: 700;
  line-height: 36px;
  color: var(--text-primary);
}
.val .num.accent {
  color: var(--green);
}

.val .unit {
  font-size: 14px;
  line-height: 20px;
  color: var(--text-secondary);
}

.range {
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 14px;
  color: var(--text-muted);
}

/* ---- 曲线图行 ---- */
.chart-row {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 16px;
}

.chart-card {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.card-head {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 21px;
  color: var(--text-primary);
}

.legend {
  display: flex;
  gap: 14px;
}

.lg {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  line-height: 17px;
  color: var(--text-secondary);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
}
.dot.orange {
  background: var(--orange);
}
.dot.cyan {
  background: var(--cyan);
}
.dot.red {
  background: var(--red);
}
.dot.green {
  background: var(--green);
}

.chart {
  position: relative;
  flex: 1;
  min-height: 0;
}

.stats {
  flex: none;
  display: flex;
  gap: 12px;
}

.stat {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 10px;
  background: var(--surface-raised);
  border-radius: 8px;
}

.stat-label {
  font-size: 11px;
  line-height: 15px;
  color: var(--text-secondary);
}

.stat-value {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 500;
  line-height: 24px;
}
.stat-value.orange {
  color: var(--orange);
}
.stat-value.cyan {
  color: var(--cyan);
}
.stat-value.red {
  color: var(--red);
}
.stat-value.green {
  color: var(--green);
}

.page {
  font-family: var(--font-sans, 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif);
  -webkit-font-smoothing: antialiased;
}
.tab,
.nav-tab,
.top-tab,
.setting-tab,
.st {
  cursor: pointer;
}
</style>
