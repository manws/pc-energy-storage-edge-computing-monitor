<template>
  <StageFrame>
    <div id="stage" class="page">
      <section id="screen" class="screen">
        <header class="top-bar">
          <div class="tb-left">
            <button class="back" type="button" @click="go('/')">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  fill="#A1A1AA"
                  transform="matrix(1 0 0 1 6 4)"
                  d="M-0.7071 4.7071L3.2929 8.7071Q3.5808 9.0121 4 9Q4.4192 9.0121 4.7071 8.7071Q5.0121 8.4192 5 8Q5.0121 7.5808 4.7071 7.2929L1.4142 4L4.7071 0.7071Q5.0121 0.4192 5 0Q5.0121 -0.4192 4.7071 -0.7071Q4.4192 -1.0121 4 -1Q3.5808 -1.0121 3.2929 -0.7071L-0.7071 3.2929Q-1.0121 3.5808 -1 4Q-1.0121 4.4192 -0.7071 4.7071Z"
                />
              </svg>
              <span>返回</span>
            </button>
            <h1 class="title">{{ clusterName }}</h1>
          </div>
        </header>
        <div class="header-divider"></div>

        <main class="content">
          <div class="section-header">
            <div class="sub">{{ packSummary }}</div>
          </div>

          <p v-if="error" class="state">{{ error }}</p>
          <p v-else-if="loading" class="state">加载中</p>
          <p v-else-if="!packs.length" class="state">该簇暂无 PACK 数据</p>
          <div v-else class="pack-grid">
            <article v-for="item in packs" :key="item.id" class="pack-card">
              <span class="watermark" aria-hidden="true">{{ item.id }}</span>
              <div class="card-head">
                <span class="pack-name">{{ item.title }}</span>
              </div>
              <div class="metrics">
                <div class="metric metric-soc">
                  <span class="l">SOC</span>
                  <span class="v accent">{{ item.soc }}</span>
                  <span class="bar"><i :style="{ width: socPercent(item.soc) + '%' }"></i></span>
                </div>
                <div class="metric">
                  <span class="l">总电压</span>
                  <span class="v">{{ item.totalV }}</span>
                </div>
                <div class="metric">
                  <span class="l">总电流</span>
                  <span class="v">{{ item.totalI }}</span>
                </div>
              </div>
              <div class="extremes">
                <div class="extreme">
                  <span class="l">最高单体</span><span class="v">{{ item.cellMax }}</span>
                </div>
                <div class="extreme">
                  <span class="l">最低单体</span><span class="v">{{ item.cellMin }}</span>
                </div>
                <div class="extreme">
                  <span class="l">最高温度</span><span class="v">{{ item.tempMax }}</span>
                </div>
                <div class="extreme">
                  <span class="l">最低温度</span><span class="v">{{ item.tempMin }}</span>
                </div>
              </div>
              <div class="card-actions">
                <button class="detail-btn primary" type="button" @click="go(packPath(item.id))">
                  查看详情
                </button>
                <button
                  class="detail-btn"
                  type="button"
                  @click="go(packPath(item.id) + '/algorithm')"
                >
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
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StageFrame from '@/components/StageFrame.vue'
import { loadPacks } from '@/api/edge'

const route = useRoute()
const router = useRouter()
const clusterId = computed(() => String(route.params.id || '1'))
const clusterName = computed(() => `#${clusterId.value}簇`)
const packs = ref([])
const loading = ref(false)
const error = ref('')
const packSummary = computed(() => {
  if (loading.value || error.value || !packs.value.length) return 'PACK 运行状态'
  return `${packs.value.length} 个 PACK 运行状态`
})

watch(
  clusterId,
  async (id) => {
    loading.value = true
    error.value = ''
    packs.value = []
    try {
      packs.value = await loadPacks(id)
    } catch (err) {
      error.value = err.message || '加载失败'
    } finally {
      loading.value = false
    }
  },
  { immediate: true }
)

function packPath(packId) {
  return `/cluster/${clusterId.value}/pack/${packId}`
}

function go(path) {
  if (router.currentRoute.value.path !== path) {
    router.push(path)
  }
}

function socPercent(value) {
  const number = Number.parseFloat(value)
  if (Number.isNaN(number)) return 0
  return Math.min(100, Math.max(0, number))
}
</script>

<style scoped>
.state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.page {
  --bg-page: #0f1d38;
  --bg-surface: #18294d;
  --bg-elevated: #243b66;
  --border-line: #2a3f68;
  --border-btn: #3c5486;
  --divider-card: #27272a;
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --accent: #29b6f6;
  --r-logo: 3px;
  --r-tab: 8px;
  --r-btn: 8px;
  --r-card: 12px;
  --font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
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

.top-bar {
  flex: none;
  height: 56px;
  padding: 0 24px;
  background: var(--bg-surface);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tb-left {
  display: flex;
  align-items: center;
  gap: 16px;
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

.updated {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 17px;
  color: var(--text-muted);
}

.header-divider {
  flex: none;
  height: 1px;
  background: var(--border-line);
}

.content {
  flex: 1;
  min-height: 0;
  padding: 16px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: auto;
}

.section-header {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px 6px 8px;
  border: none;
  border-radius: 8px;
  background: var(--bg-elevated);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  color: var(--text-secondary);
  cursor: pointer;
}

.back:hover {
  background: #2c4675;
}

.back svg {
  flex: none;
}

.sub {
  font-size: 13px;
  color: var(--text-secondary);
}

.pack-grid {
  flex: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-content: start;
  gap: 16px;
}

.pack-card {
  position: relative;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(41, 182, 246, 0.08), transparent 72px), var(--bg-surface);
  border: 1px solid var(--border-line);
  border-radius: var(--r-card);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition:
    border-color 0.18s ease,
    background 0.18s ease;
}

.pack-card:hover {
  border-color: #3c5486;
  background: linear-gradient(180deg, rgba(41, 182, 246, 0.12), transparent 72px), #1c3158;
}

.pack-card > :not(.watermark) {
  position: relative;
  z-index: 1;
}

.watermark {
  position: absolute;
  right: -4px;
  top: -18px;
  z-index: 0;
  font-family: var(--font-mono);
  font-size: 92px;
  font-weight: 700;
  line-height: 1;
  color: rgba(41, 182, 246, 0.08);
  -webkit-text-stroke: 1px rgba(41, 182, 246, 0.22);
  pointer-events: none;
  user-select: none;
}

.card-head {
  display: flex;
  align-items: center;
}

.pack-name {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--text-primary);
}

.metrics {
  display: grid;
  grid-template-columns: 1.3fr 1fr 1fr;
  gap: 10px;
}

.metric {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric .l,
.extreme .l {
  font-size: 11px;
  color: var(--text-secondary);
  white-space: nowrap;
}

.metric .v,
.extreme .v {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.metric .v.accent {
  color: var(--accent);
}

.bar {
  height: 3px;
  border-radius: 3px;
  background: rgba(41, 182, 246, 0.16);
  overflow: hidden;
}

.bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #1e88c7, var(--accent));
}

.extremes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.extreme {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(15, 29, 56, 0.55);
}

.extreme .v {
  font-size: 13px;
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.detail-btn {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--border-btn);
  border-radius: var(--r-btn);
  background: transparent;
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease;
}

.detail-btn.primary {
  border-color: rgba(41, 182, 246, 0.45);
  background: rgba(41, 182, 246, 0.14);
  color: #7dd3fc;
}

.detail-btn:hover {
  border-color: #4a639a;
  color: var(--text-primary);
}

.detail-btn.primary:hover {
  background: rgba(41, 182, 246, 0.24);
  border-color: var(--accent);
  color: #e0f2fe;
}
</style>
