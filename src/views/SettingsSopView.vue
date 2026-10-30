<template>
  <StageFrame>
    <div id="stage" class="page stage">
      <!-- 顶栏 -->
      <header class="topbar">
        <div class="brand">
          <div class="brand-logo"></div>
          <div class="brand-name">多状态在线估计算法的边缘端硬件装置</div>
        </div>
        <nav class="nav-tabs">
          <div class="nav-tab" @click="go('/')">实时监控</div>
          <div class="nav-tab active" @click="go('/settings/soc')">系统设置</div>
        </nav>
        <div class="status">
          <div class="status-dot"></div>
          <div class="status-text">在线</div>
          <div class="status-time">最后更新 14:32:05</div>
        </div>
      </header>
      <div class="divider"></div>

      <!-- 内容区 -->
      <main class="content">
        <!-- 设置页签 -->
        <div id="settingTabs" class="setting-tabs">
          <div class="setting-tab st-med" @click="go('/settings/soc')">SOC 估算设置</div>
          <div class="setting-tab" @click="go('/settings/soe')">SOE 估算设置</div>
          <div class="setting-tab active" @click="go('/settings/sop')">SOP 估算设置</div>
          <div class="setting-tab" @click="go('/settings/inconsistency')">不一致性估算设置</div>
          <div class="setting-tab" @click="go('/settings/alert')">预警估算设置</div>
        </div>

        <!-- 设置面板 -->
        <section class="panel">
          <div class="panel-head">
            <div class="panel-title">SOP 估算设置</div>
            <div class="panel-subtitle">配置最大充放电功率估算的采样与参考参数</div>
          </div>
          <div class="panel-divider"></div>

          <div class="form">
            <!-- 时间窗（点数） -->
            <div class="field-card">
              <div class="field-label">时间窗（点数）</div>
              <div class="field-hint">参与 SOP 滑动估算的采样点数量</div>
              <div
                class="control"
                :class="{ 'is-active': activeId === 'sop-window' }"
                data-soft-kb
                @mousedown.prevent
                @click.stop="edit('sop-window', '时间窗（点数）')"
              >
                <input
                  id="windowInput"
                  :value="windowPoints"
                  type="text"
                  readonly
                  inputmode="none"
                  tabindex="-1"
                  spellcheck="false"
                />
                <span class="control-unit">点</span>
              </div>
            </div>

            <!-- 采样频率 -->
            <div class="field-card">
              <div class="field-label">采样频率</div>
              <div class="field-hint">数据采集的时间间隔</div>
              <SelectField v-model="sampleFrequency" />
            </div>

            <!-- 估算参考电压值 -->
            <div class="field-card tall">
              <div class="field-label">估算参考电压值</div>
              <div class="field-hint">选择单体电压的统计参考方式</div>
              <div id="radioGroup" class="radio-group">
                <div
                  class="radio-opt"
                  :class="{ selected: refValue === 'avg' }"
                  @click="refValue = 'avg'"
                >
                  <span class="radio-ring"></span>
                  <span class="radio-label">平均值</span>
                </div>
                <div
                  class="radio-opt"
                  :class="{ selected: refValue === 'geometric' }"
                  @click="refValue = 'geometric'"
                >
                  <span class="radio-ring"></span>
                  <span class="radio-label">几何平均值</span>
                </div>
                <div
                  class="radio-opt"
                  :class="{ selected: refValue === 'median' }"
                  @click="refValue = 'median'"
                >
                  <span class="radio-ring"></span>
                  <span class="radio-label">中位数</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <div class="footer">
            <button id="btnReset" class="btn btn-reset" type="button" @click="resetForm">
              重置
            </button>
            <button id="btnSave" class="btn btn-save">保存设置</button>
          </div>
        </section>
      </main>
    </div>
  </StageFrame>
</template>

<script setup>
import { ref } from 'vue'
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
const refValue = ref('avg')
const fields = { 'sop-window': windowPoints }

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
  refValue.value = 'avg'
}
</script>

<style scoped>
.page {
  --bg-page: #0f1d38;
  --bg-bar: #18294d;
  --bg-card: #243b66;
  --bg-card-active: #17386b;
  --line: #2a3f68;
  --bg-field: #35598a;
  --line-field: #6b8fc0;
  --cyan: #29b6f6;
  --green: #4caf50;
  --txt-1: #fafafa;
  --txt-2: #a1a1aa;
  --txt-3: #71717a;
  --font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', Consolas, monospace;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.stage {
  width: 100%;
  height: 100%;
  flex: none;
  display: flex;
  flex-direction: column;
  background: var(--bg-page);
  overflow: hidden;
}

/* ===== 顶栏 ===== */
.topbar {
  height: 56px;
  flex: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: var(--bg-bar);
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
  background: var(--cyan);
}
.brand-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--txt-1);
}

.nav-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
}
.nav-tab {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--txt-2);
  cursor: pointer;
  transition:
    color 0.15s,
    background-color 0.15s;
  user-select: none;
}
.nav-tab:hover {
  color: var(--txt-1);
}
.nav-tab.active {
  background: var(--bg-card);
  color: var(--txt-1);
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--green);
}
.status-text {
  font-size: 13px;
  color: var(--txt-2);
}
.status-time {
  font-size: 13px;
  font-family: var(--font-mono);
  color: var(--txt-3);
}

.divider {
  height: 1px;
  flex: none;
  background: var(--line);
}

/* ===== 内容区 ===== */
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
  flex: none;
}
.setting-tab {
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 400;
  color: var(--txt-2);
  background: var(--bg-card);
  cursor: pointer;
  border: 1px solid transparent;
  transition:
    color 0.15s,
    border-color 0.15s;
  user-select: none;
}
.setting-tab.st-med {
  font-weight: 500;
}
.setting-tab:hover {
  color: var(--txt-1);
}
.setting-tab.active {
  background: var(--bg-card-active);
  border-color: var(--cyan);
  color: var(--cyan);
}

/* ===== 设置面板 ===== */
.panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  background: var(--bg-bar);
  border: 1px solid var(--line);
  border-radius: 12px;
}
.panel-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--txt-1);
}
.panel-subtitle {
  font-size: 13px;
  color: var(--txt-2);
}
.panel-divider {
  height: 1px;
  flex: none;
  background: var(--line);
}

.form {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 16px;
}

.field-card {
  width: calc(50% - 8px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--bg-card);
  border-radius: 8px;
}
.field-card.tall {
  gap: 12px;
}
.field-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--txt-1);
}
.field-hint {
  font-size: 11px;
  color: var(--txt-3);
}

.control {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background: var(--bg-field);
  border: 1px solid var(--line-field);
  border-radius: 6px;
}
.control input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 500;
  color: var(--txt-1);
  cursor: pointer;
}
.control.is-active {
  border-color: var(--cyan);
  box-shadow: 0 0 0 3px rgba(41, 182, 246, 0.15);
}
.control .control-value {
  font-size: 14px;
  color: var(--txt-1);
}
.control .control-unit {
  font-size: 12px;
  color: var(--txt-3);
}
.control .chevron {
  flex: none;
  display: flex;
}

/* 单选组 */
.radio-group {
  display: flex;
  gap: 24px;
  padding-top: 2px;
}
.radio-opt {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}
.radio-ring {
  width: 18px;
  height: 18px;
  flex: none;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.radio-ring::before {
  content: '';
  position: absolute;
  inset: 1.8px;
  border-radius: 50%;
  border: 1px solid #52525b;
}
.radio-ring::after {
  content: '';
  width: 7.2px;
  height: 7.2px;
  border-radius: 50%;
  background: transparent;
}
.radio-opt.selected .radio-ring::before {
  border-color: var(--cyan);
}
.radio-opt.selected .radio-ring::after {
  background: var(--cyan);
}
.radio-label {
  font-size: 13px;
  color: var(--txt-2);
}
.radio-opt.selected .radio-label {
  color: var(--txt-1);
}

/* ===== 底部按钮 ===== */
.footer {
  flex: none;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn {
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition:
    filter 0.15s,
    background-color 0.15s;
}
.btn-reset {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid var(--line-field);
  color: var(--txt-2);
}
.btn-reset:hover {
  color: var(--txt-1);
  border-color: var(--txt-3);
}
.btn-save {
  padding: 10px 24px;
  background: var(--cyan);
  border: none;
  color: #0e0e10;
}
.btn-save:hover {
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
