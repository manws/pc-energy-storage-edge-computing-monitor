<template>
  <StageFrame>
    <div id="stage" class="page stage">
      <!-- Top Bar -->
      <header class="top-bar">
        <div class="brand">
          <div class="logo"></div>
          <div class="brand-name">储能 · 边缘计算监控系统</div>
        </div>
        <nav class="nav-tabs">
          <div class="nav-tab" @click="go('/')">实时监控</div>
          <div class="nav-tab active" @click="go('/settings/soc')">系统设置</div>
        </nav>
        <div class="status">
          <div class="dot"></div>
          <div class="status-text">在线</div>
          <div class="status-time">最后更新 14:32:05</div>
        </div>
      </header>

      <div class="divider"></div>

      <!-- Content -->
      <main class="content">
        <div class="setting-tabs">
          <div class="setting-tab" @click="go('/settings/soc')">SOC 估算设置</div>
          <div class="setting-tab" @click="go('/settings/soe')">SOE 估算设置</div>
          <div class="setting-tab" @click="go('/settings/sop')">SOP 估算设置</div>
          <div class="setting-tab active" @click="go('/settings/inconsistency')">
            不一致性估算设置
          </div>
          <div class="setting-tab" @click="go('/settings/alert')">预警估算设置</div>
        </div>

        <section class="panel">
          <div class="panel-title">
            <div class="title">不一致性估算设置</div>
            <div class="subtitle">配置单体一致性检测的采样与算法参数</div>
          </div>
          <div class="panel-divider"></div>

          <div class="form">
            <div class="field-card fixed">
              <div class="label">时间窗（点数）</div>
              <div class="hint">参与一致性估算的采样点数量</div>
              <div
                class="input"
                :class="{ 'is-active': activeId === 'inconsistency-window' }"
                data-soft-kb
                @mousedown.prevent
                @click.stop="edit('inconsistency-window', '时间窗（点数）')"
              >
                <input
                  class="value"
                  type="text"
                  :value="windowPoints"
                  readonly
                  inputmode="none"
                  tabindex="-1"
                  aria-label="时间窗（点数）"
                />
                <div class="unit">点</div>
              </div>
            </div>

            <div class="field-card fixed">
              <div class="label">采样频率</div>
              <div class="hint">数据采集的时间间隔</div>
              <SelectField v-model="sampleFrequency" />
            </div>

            <div class="field-card fixed">
              <div class="label">特征分量数</div>
              <div class="hint">主成分分析保留的特征维度数量</div>
              <div
                class="input"
                :class="{ 'is-active': activeId === 'feature-count' }"
                data-soft-kb
                @mousedown.prevent
                @click.stop="edit('feature-count', '特征分量数')"
              >
                <input
                  class="value"
                  type="text"
                  :value="featureCount"
                  readonly
                  inputmode="none"
                  tabindex="-1"
                  aria-label="特征分量数"
                />
                <div class="unit">个</div>
              </div>
            </div>

            <div class="field-card slider-card">
              <div class="label">卡方置信度阈值</div>
              <div class="hint">取值范围 0.5 – 1.0,越高判定越严格</div>
              <div class="slider-row">
                <div
                  ref="trackRef"
                  class="slider-track"
                  @pointerdown="onPointerDown"
                  @pointermove="onPointerMove"
                  @pointerup="onPointerUp"
                  @pointercancel="onPointerUp"
                >
                  <div class="slider-fill" :style="{ width: sliderPercent }"></div>
                  <div
                    class="slider-knob"
                    :style="{ left: 'calc(' + sliderPercent + ' - 7px)' }"
                  ></div>
                </div>
                <div class="slider-value">{{ threshold.toFixed(2) }}</div>
              </div>
            </div>
          </div>

          <div class="panel-footer">
            <button class="btn btn-secondary" type="button" @click="resetForm">重置</button>
            <button class="btn btn-primary">保存设置</button>
          </div>
        </section>
      </main>
    </div>
  </StageFrame>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import StageFrame from '@/components/StageFrame.vue'
import SelectField from '@/components/SelectField.vue'
import { useSoftKeyboard } from '@/composables/useSoftKeyboard'

const router = useRouter()
const { activeId, open } = useSoftKeyboard()

function go(path) {
  if (router.currentRoute.value.path !== path) {
    router.push(path)
  }
}

const windowPoints = ref('60')
const sampleFrequency = ref('1 秒 / 点')
const featureCount = ref('8')
const fields = {
  'inconsistency-window': windowPoints,
  'feature-count': featureCount
}

function edit(id, hint) {
  const source = fields[id]
  open({
    id,
    hint,
    get: () => source.value,
    set: (value) => {
      source.value = value
    }
  })
}

function resetForm() {
  windowPoints.value = '60'
  sampleFrequency.value = '1 秒 / 点'
  featureCount.value = '8'
  threshold.value = 0.95
}

const MIN = 0.5
const MAX = 1
const threshold = ref(0.95)
const dragging = ref(false)
const trackRef = ref(null)
const sliderPercent = computed(() => {
  const ratio = (threshold.value - MIN) / (MAX - MIN)
  return `${(ratio * 100).toFixed(2)}%`
})

function posToValue(clientX) {
  const rect = trackRef.value.getBoundingClientRect()
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  return MIN + ratio * (MAX - MIN)
}

function onPointerDown(event) {
  dragging.value = true
  threshold.value = posToValue(event.clientX)
  try {
    event.currentTarget.setPointerCapture(event.pointerId)
  } catch (_) {
    /* 指针尚未激活时忽略，拖动仍由 pointermove 更新 */
  }
}

function onPointerMove(event) {
  if (!dragging.value) return
  threshold.value = posToValue(event.clientX)
}

function onPointerUp() {
  dragging.value = false
}
</script>

<style scoped>
.page {
  --bg-page: #0f1d38;
  --bg-bar: #18294d;
  --bg-card: #243b66;
  --bg-card-active: #17386b;
  --accent: #29b6f6;
  --text-1: #fafafa;
  --text-2: #a1a1aa;
  --text-3: #71717a;
  --divider: #2a3f68;
  --divider-2: #27272a;
  --input-bg: #35598a;
  --input-border: #6b8fc0;
  --green: #4caf50;
  --font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.stage {
  width: 1280px;
  height: 800px;
  background: var(--bg-page);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

/* ============ Top Bar ============ */
.top-bar {
  height: 56px;
  flex-shrink: 0;
  background: var(--bg-bar);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand .logo {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: var(--accent);
}
.brand .brand-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-1);
}
.nav-tabs {
  display: flex;
  gap: 4px;
}
.nav-tab {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-2);
  cursor: pointer;
  transition: color 0.15s ease;
}
.nav-tab:hover {
  color: var(--text-1);
}
.nav-tab.active {
  background: var(--bg-card);
  color: var(--text-1);
}
.status {
  display: flex;
  align-items: center;
  gap: 8px;
}
.status .dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: var(--green);
}
.status .status-text {
  font-size: 13px;
  color: var(--text-2);
}
.status .status-time {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-3);
}

.divider {
  height: 1px;
  flex-shrink: 0;
  background: var(--divider);
}

/* ============ Content ============ */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  min-height: 0;
}
.setting-tabs {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.setting-tab {
  padding: 9px 16px;
  border-radius: 8px;
  background: var(--bg-card);
  border: 1px solid transparent;
  font-size: 13px;
  color: var(--text-2);
  cursor: pointer;
  transition: color 0.15s ease;
}
.setting-tab:hover {
  color: var(--text-1);
}
.setting-tab.active {
  background: var(--bg-card-active);
  border-color: var(--accent);
  color: var(--accent);
}

/* ============ Panel ============ */
.panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border-radius: 12px;
  background: var(--bg-bar);
  border: 1px solid var(--divider);
}
.panel-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.panel-title .title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-1);
}
.panel-title .subtitle {
  font-size: 13px;
  color: var(--text-2);
}
.panel-divider {
  height: 1px;
  flex-shrink: 0;
  background: var(--divider-2);
}

/* ============ Form ============ */
.form {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-content: flex-start;
}
.field-card {
  width: 580px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 8px;
  background: var(--bg-card);
}
.field-card.fixed {
  height: 128px;
}
.field-card .label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-1);
}
.field-card .hint {
  font-size: 11px;
  color: var(--text-3);
}
.field-card.slider-card {
  gap: 12px;
}

.input {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-radius: 6px;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
}
.input .value {
  flex: 1;
  min-width: 0;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 500;
  color: var(--text-1);
  cursor: pointer;
}
.input.is-active {
  border-color: #29b6f6;
  box-shadow: 0 0 0 3px rgba(41, 182, 246, 0.15);
}
.input .unit {
  font-size: 12px;
  color: var(--text-3);
}

.dropdown {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0 12px;
  border-radius: 6px;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  cursor: pointer;
}
.dropdown .value {
  font-size: 14px;
  color: var(--text-1);
}
.dropdown svg {
  flex-shrink: 0;
}

/* ============ Slider ============ */
.slider-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
}
.slider-track {
  position: relative;
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--divider-2);
  cursor: pointer;
  touch-action: none;
}
.slider-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 6px;
  border-radius: 3px;
  background: var(--accent);
  width: 84.5%;
}
.slider-knob {
  position: absolute;
  top: -4px;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background: #ffffff;
  left: calc(84.5% - 7px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
.slider-value {
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 500;
  color: var(--accent);
}

/* ============ Footer ============ */
.panel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}
.btn {
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-sans);
  transition:
    filter 0.15s ease,
    background 0.15s ease;
}
.btn-secondary {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid var(--input-border);
  color: var(--text-2);
}
.btn-secondary:hover {
  color: var(--text-1);
  border-color: var(--text-3);
}
.btn-primary {
  padding: 10px 24px;
  background: var(--accent);
  border: none;
  color: #0e0e10;
}
.btn-primary:hover {
  filter: brightness(1.1);
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
