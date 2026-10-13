<template>
  <StageFrame>
    <div id="stage" class="page">
      <section id="screen" class="screen">
        <!-- Top Bar -->
        <header class="top-bar">
          <div class="brand">
            <span class="logo"></span>
            <span class="system-name">储能 · 边缘计算监控系统</span>
          </div>
          <nav class="tabs">
            <span class="tab is-active" @click="go('/')">实时监控</span>
            <span class="tab" @click="go('/settings/soc')">系统设置</span>
          </nav>
          <div class="status">
            <span class="dot"></span>
            <span class="online">在线</span>
            <span id="updated" class="updated">最后更新 14:32:05</span>
          </div>
        </header>
        <div class="header-divider"></div>

        <!-- Content -->
        <main class="content">
          <div class="section-header">
            <div class="titles">
              <div class="h">实时监控</div>
              <div class="sub">实时运行状态</div>
            </div>
            <div class="legend">
              <div class="legend-item"><span class="d ok"></span><span class="t">正常</span></div>
              <div class="legend-item"><span class="d warn"></span><span class="t">预警</span></div>
              <div class="legend-item">
                <span class="d error"></span><span class="t">异常</span>
              </div>
            </div>
          </div>

          <div class="bms-grid">
            <article v-for="item in clusters" :key="item.title" class="bms-card">
              <div class="card-header">
                <span class="title">{{ item.title }}</span>
                <span class="status-pill" :class="toneOf(item.status)">{{ item.status }}</span>
              </div>
              <div class="card-divider"></div>
              <div class="field-grid">
                <div class="field">
                  <span class="l">总电压</span><span class="v">{{ item.totalV }}</span>
                </div>
                <div class="field">
                  <span class="l">总电流</span><span class="v">{{ item.totalI }}</span>
                </div>
                <div class="field">
                  <span class="l">SOC</span>
                  <span class="v" :class="toneOf(item.status)">{{ item.soc }}</span>
                </div>
                <div class="field">
                  <span class="l">最高单体</span><span class="v">{{ item.cellMax }}</span>
                </div>
                <div class="field">
                  <span class="l">最低单体</span><span class="v">{{ item.cellMin }}</span>
                </div>
                <div class="field">
                  <span class="l">最高温度</span><span class="v">{{ item.tempMax }}</span>
                </div>
                <div class="field">
                  <span class="l">最低温度</span><span class="v">{{ item.tempMin }}</span>
                </div>
              </div>
              <div class="card-actions">
                <button class="detail-btn" type="button" @click="go('/bms/' + item.id)">详情</button>
                <button class="detail-btn" type="button" @click="go('/bms/' + item.id + '/algorithm')">
                  算法估算
                </button>
              </div>
            </article>
          </div>
        </main>
      </section>
    </div>
  </StageFrame>
</template>

<script setup>
import { useRouter } from 'vue-router'
import StageFrame from '@/components/StageFrame.vue'

const router = useRouter()

function go(path) {
  if (router.currentRoute.value.path !== path) {
    router.push(path)
  }
}

const clusters = [
  {
    id: '1',
    title: '1簇',
    status: '正常',
    totalV: '712.5 V',
    totalI: '128.6 A',
    soc: '86.2 %',
    cellMax: '3.412 V',
    cellMin: '3.398 V',
    tempMax: '32.5 ℃',
    tempMin: '28.1 ℃'
  },
  {
    id: '2',
    title: '2簇',
    status: '正常',
    totalV: '709.8 V',
    totalI: '132.1 A',
    soc: '84.7 %',
    cellMax: '3.408 V',
    cellMin: '3.391 V',
    tempMax: '33.1 ℃',
    tempMin: '27.9 ℃'
  },
  {
    id: '3',
    title: '3簇',
    status: '正常',
    totalV: '714.2 V',
    totalI: '119.4 A',
    soc: '88.0 %',
    cellMax: '3.415 V',
    cellMin: '3.402 V',
    tempMax: '31.8 ℃',
    tempMin: '28.4 ℃'
  },
  {
    id: '4',
    title: '4簇',
    status: '预警',
    totalV: '705.6 V',
    totalI: '141.7 A',
    soc: '79.3 %',
    cellMax: '3.401 V',
    cellMin: '3.372 V',
    tempMax: '35.6 ℃',
    tempMin: '29.0 ℃'
  },
  {
    id: '5',
    title: '5簇',
    status: '正常',
    totalV: '711.9 V',
    totalI: '126.3 A',
    soc: '85.5 %',
    cellMax: '3.410 V',
    cellMin: '3.396 V',
    tempMax: '32.0 ℃',
    tempMin: '27.6 ℃'
  }
]

const tones = { 正常: 'ok', 预警: 'warn', 异常: 'error' }

function toneOf(status) {
  return tones[status] || 'ok'
}
</script>

<style scoped>
.page {
  /* Surfaces */
  --bg-page: #0f1d38;
  --bg-surface: #18294d;
  --bg-elevated: #243b66;
  --border-line: #2a3f68;
  --border-btn: #3c5486;
  --divider-card: #27272a;

  /* Text */
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;

  /* Semantic */
  --accent: #29b6f6;
  --ok: #4caf50;
  --warn: #f2c94c;
  --error: #ff5252;
  --pill-ok: #182c1a;
  --pill-warn: #2e2a16;
  --pill-error: #2e1818;

  /* Radius */
  --r-logo: 3px;
  --r-dot: 4px;
  --r-pill: 6px;
  --r-tab: 8px;
  --r-btn: 8px;
  --r-card: 12px;

  --font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ---------- Stage: 原始画布 1280×800 + 等比缩放 ---------- */
#stage {
  width: 1280px;
  height: 800px;
}

.screen {
  width: 1280px;
  height: 800px;
  background: var(--bg-page);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ---------- Top Bar ---------- */
.top-bar {
  flex: none;
  height: 56px;
  padding: 0 24px;
  background: var(--bg-surface);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.brand .logo {
  width: 12px;
  height: 12px;
  border-radius: var(--r-logo);
  background: var(--accent);
}

.brand .system-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.tabs {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.tab {
  padding: 7px 14px;
  border-radius: var(--r-tab);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  background: transparent;
  cursor: pointer;
  user-select: none;
  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.tab:hover {
  color: var(--text-primary);
  background: rgba(36, 59, 102, 0.55);
}

.tab.is-active {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.status {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.status .dot {
  width: 8px;
  height: 8px;
  border-radius: var(--r-dot);
  background: var(--ok);
}

.status .online {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);
}

.status .updated {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 400;
  color: var(--text-muted);
}

.header-divider {
  flex: none;
  height: 1px;
  background: var(--border-line);
}

/* ---------- Content ---------- */
.content {
  flex: 1;
  min-height: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
}

.section-header {
  flex: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.titles {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.titles .h {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
}

.titles .sub {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-secondary);
}

.legend {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.legend-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

.legend-item .d {
  width: 8px;
  height: 8px;
  border-radius: var(--r-dot);
}

.legend-item .d.ok {
  background: var(--ok);
}
.legend-item .d.warn {
  background: var(--warn);
}
.legend-item .d.error {
  background: var(--error);
}

.legend-item .t {
  font-size: 12px;
  font-weight: 400;
  color: var(--text-secondary);
}

/* ---------- BMS Grid ---------- */
.bms-grid {
  flex: none;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

/* ---------- BMS Card ---------- */
.bms-card {
  background: var(--bg-surface);
  border: 1px solid var(--border-line);
  border-radius: var(--r-card);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.card-header .title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.status-pill {
  padding: 3px 8px;
  border-radius: var(--r-pill);
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

.status-pill.ok {
  background: var(--pill-ok);
  color: var(--ok);
}
.status-pill.warn {
  background: var(--pill-warn);
  color: var(--warn);
}
.status-pill.error {
  background: var(--pill-error);
  color: var(--error);
}

.card-divider {
  height: 1px;
  background: var(--divider-card);
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.field .l {
  font-size: 10px;
  font-weight: 400;
  color: var(--text-secondary);
  white-space: nowrap;
}

.field .v {
  font-family: var(--font-mono);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.field .v.ok {
  color: var(--ok);
}
.field .v.warn {
  color: var(--warn);
}
.field .v.error {
  color: var(--error);
}

.card-actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.detail-btn {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 4px;
  border: 1px solid var(--border-btn);
  border-radius: var(--r-btn);
  background: var(--bg-elevated);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  color: var(--accent);
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;
}

.detail-btn:hover {
  background: #2a4474;
  border-color: #4a639a;
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
