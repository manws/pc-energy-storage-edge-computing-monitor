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
              <div class="h">边缘整体监控</div>
              <div class="sub">5 簇运行总览</div>
            </div>
            <div class="legend">
              <div class="legend-item"><span class="d ok"></span><span class="t">正常</span></div>
              <div class="legend-item"><span class="d warn"></span><span class="t">预警</span></div>
              <div class="legend-item">
                <span class="d error"></span><span class="t">异常</span>
              </div>
            </div>
          </div>

          <div class="cluster-grid">
            <button
              v-for="item in clusters"
              :key="item.id"
              class="cluster-card"
              type="button"
              @click="go('/cluster/' + item.id)"
            >
              <span class="watermark" aria-hidden="true">{{ item.id }}</span>
              <div class="card-header">
                <span class="title">{{ item.title }}</span>
                <span class="status-pill" :class="toneOf(item.status)">{{ item.status }}</span>
              </div>
            </button>
          </div>
        </main>
      </section>
    </div>
  </StageFrame>
</template>

<script setup>
import { useRouter } from 'vue-router'
import StageFrame from '@/components/StageFrame.vue'
import { getClusters } from '@/mock/cluster'

const router = useRouter()
const clusters = getClusters()

function go(path) {
  if (router.currentRoute.value.path !== path) {
    router.push(path)
  }
}

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

/* ---------- Cluster Grid ---------- */
.cluster-grid {
  flex: none;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: start;
  gap: 16px;
}

.cluster-card {
  position: relative;
  overflow: hidden;
  background: var(--bg-surface);
  border: 1px solid var(--border-line);
  border-radius: var(--r-card);
  height: 148px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  text-align: left;
  font-family: var(--font-sans);
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;
}

.cluster-card > :not(.watermark) {
  position: relative;
  z-index: 1;
}

.watermark {
  position: absolute;
  right: -8px;
  bottom: -36px;
  z-index: 0;
  font-family: var(--font-mono);
  font-size: 148px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.06em;
  color: rgba(41, 182, 246, 0.1);
  -webkit-text-stroke: 1.5px rgba(41, 182, 246, 0.26);
  pointer-events: none;
  user-select: none;
  -webkit-mask-image: linear-gradient(to top, #000 18%, rgba(0, 0, 0, 0.45) 58%, transparent);
  mask-image: linear-gradient(to top, #000 18%, rgba(0, 0, 0, 0.45) 58%, transparent);
}

.cluster-card:hover {
  background: #1c3158;
  border-color: #3c5486;
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
