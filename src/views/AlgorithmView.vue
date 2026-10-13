<template>
  <StageFrame>
    <div id="stage" class="page stage">
      <!-- 顶栏 -->
      <header class="top-bar">
        <div class="tb-left">
          <button class="back" type="button" @click="go('/')">
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
          <h1 class="page-title">{{ clusterName }} · 算法估算</h1>
        </div>
        <div class="status">
          <div class="status-dot"></div>
          <span class="status-text">在线</span>
          <span class="status-time">最后更新 14:32:05</span>
        </div>
      </header>

      <div class="divider"></div>

      <!-- 内容区 -->
      <main class="content">
        <!-- 参数行 -->
        <section class="param-row">
          <div class="param-card">
            <div class="param-label">SOE · 能量估算</div>
            <div class="param-value">
              <span class="param-num num-blue">{{ estimate.soe.toFixed(1) }}</span>
              <span class="param-unit">kWh</span>
            </div>
          </div>
          <div class="param-card">
            <div class="param-label">SOP · 放电功率</div>
            <div class="param-value">
              <span class="param-num num-amber">{{ estimate.sopDischarge.toFixed(1) }}</span>
              <span class="param-unit">kW</span>
            </div>
          </div>
          <div class="param-card">
            <div class="param-label">SOP · 充电功率</div>
            <div class="param-value">
              <span class="param-num num-green">{{ estimate.sopCharge.toFixed(1) }}</span>
              <span class="param-unit">kW</span>
            </div>
          </div>
        </section>

        <!-- 主体 -->
        <section class="body">
          <!-- 左列 -->
          <div class="col-left">
            <!-- SOC 估算卡片 -->
            <div class="card card-soc">
              <div class="card-head">
                <div class="card-title">SOC 估算</div>
                <div class="card-note">绿 正常 · 黄 偏低 · 红 异常（单位 %）</div>
              </div>
              <div class="chart">
                <SocBarChart :values="socValues" />
              </div>
            </div>

            <!-- 预警估算卡片 -->
            <div class="card card-warn">
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
            </div>
          </div>

          <!-- 右列 -->
          <div class="col-right">
            <!-- 单体不一致性卡片 -->
            <div class="card card-incons">
              <div class="card-head">
                <div class="card-title">不一致性（单体）· 416 单体</div>
                <div class="card-note warn-note">异常 {{ voltageAbnormalCount }} · 绿 正常 / 黄 异常</div>
              </div>
              <div class="chart">
                <CellGridChart :flags="voltageFlags" />
              </div>
            </div>

            <!-- 温度不一致性卡片 -->
            <div class="card card-incons">
              <div class="card-head">
                <div class="card-title">不一致性（温度）· 416 单体</div>
                <div class="card-note warn-note">异常 {{ temperatureAbnormalCount }} · 绿 正常 / 黄 异常</div>
              </div>
              <div class="chart">
                <CellGridChart :flags="temperatureFlags" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </StageFrame>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StageFrame from '@/components/StageFrame.vue'
import SocBarChart from '@/components/charts/SocBarChart.vue'
import CellGridChart from '@/components/charts/CellGridChart.vue'
import { getClusterEstimate } from '@/mock/cluster'

const route = useRoute()
const router = useRouter()
const estimate = computed(() => getClusterEstimate(route.params.id))
const clusterName = computed(() => `${estimate.value.clusterId}簇`)
const socValues = computed(() => estimate.value.cells.map((cell) => cell.soc))
const voltageFlags = computed(() => estimate.value.cells.map((cell) => cell.voltageAbnormal))
const temperatureFlags = computed(() => estimate.value.cells.map((cell) => cell.temperatureAbnormal))
const voltageAbnormalCount = computed(() => voltageFlags.value.filter(Boolean).length)
const temperatureAbnormalCount = computed(() => temperatureFlags.value.filter(Boolean).length)

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
  --red: #ff5252;
  --yellow: #f2c94c;
  --font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Consolas', monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ===== 1280×800 原始画布 + 等比缩放 ===== */
.stage {
  width: 1280px;
  height: 800px;
  background: var(--bg);
  display: flex;
  flex-direction: column;
}

/* ===== 顶栏 ===== */
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

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-logo {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--blue);
}

.brand-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
}

.tabs {
  display: flex;
  gap: 4px;
}

.tab {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  user-select: none;
  transition:
    color 0.15s,
    background-color 0.15s;
}

.tab:hover {
  color: var(--text);
}

.tab.active {
  background: var(--card-2);
  color: var(--text);
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: var(--green);
}

.status-text {
  font-size: 13px;
  color: var(--muted);
}

.status-time {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--dim);
}

.divider {
  height: 1px;
  flex-shrink: 0;
  background: var(--border);
}

/* ===== 内容区 ===== */
.content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

/* 参数行 */
.param-row {
  height: 88px;
  flex-shrink: 0;
  display: flex;
  gap: 16px;
}

.param-card {
  flex: 1;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.param-label {
  font-size: 13px;
  color: var(--muted);
}

.param-value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.param-num {
  font-family: var(--font-mono);
  font-size: 26px;
  font-weight: 700;
  line-height: 1.1;
}

.param-unit {
  font-size: 13px;
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

/* 主体两栏 */
.body {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 16px;
}

.col-left {
  width: 728px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.col-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 卡片通用 */
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.card-title {
  font-size: 15px;
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

.chart {
  position: relative;
  flex: 1;
  min-height: 0;
  border-radius: 6px;
  overflow: hidden;
}

/* SOC 卡片 */
.card-soc {
  height: 224px;
  flex-shrink: 0;
  gap: 12px;
}

/* 预警卡片 */
.card-warn {
  flex: 1;
  gap: 10px;
}

.table {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.thead {
  display: flex;
  gap: 8px;
  background: var(--card-2);
  border-radius: 6px;
  padding: 9px 10px;
  flex-shrink: 0;
}

.thead span {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted);
}

.trow {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

.col-idx {
  width: 48px;
  flex-shrink: 0;
}
.col-name {
  flex: 1;
  min-width: 0;
}
.col-time {
  width: 150px;
  flex-shrink: 0;
}

.idx {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--dim);
}

.name {
  font-size: 13px;
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
  font-size: 12px;
  color: var(--muted);
}

/* 不一致性卡片 */
.card-incons {
  flex: 1;
  gap: 10px;
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
