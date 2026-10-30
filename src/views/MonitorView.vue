<template>
  <StageFrame>
    <div id="stage" class="page">
      <section id="screen" class="screen">
        <!-- Top Bar -->
        <header class="top-bar">
          <div class="brand">
            <span class="logo"></span>
            <span class="system-name">多状态在线估计算法的边缘端硬件装置</span>
          </div>
          <div class="status">
            <span class="dot"></span>
            <span class="online">在线</span>
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
          </div>

          <div class="cluster-grid">
            <button
              v-for="item in clusters"
              :key="item.id"
              class="cluster-card"
              type="button"
              @click="go('/cluster/' + item.id)"
            >
              <span class="watermark" aria-hidden="true">#{{ item.id }}</span>
              <div class="card-header">
                <span class="title">{{ item.title }}</span>
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
</script>

<style scoped>
.page {
  /* Surfaces */
  --bg-page: #0f1d38;
  --bg-surface: #18294d;
  --border-line: #2a3f68;

  /* Text */
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;

  /* Semantic */
  --accent: #29b6f6;
  --ok: #4caf50;

  /* Radius */
  --r-logo: 3px;
  --r-dot: 4px;
  --r-card: 12px;

  --font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#stage,
.screen {
  width: 100%;
  height: 100%;
}

.screen {
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

.page {
  font-family: var(--font-sans, 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif);
  -webkit-font-smoothing: antialiased;
}
</style>
