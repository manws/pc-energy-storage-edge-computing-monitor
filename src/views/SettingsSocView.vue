<template>
  <StageFrame>
    <div id="stage" class="page stage">
      <!-- 顶栏 -->
      <header class="top-bar">
        <div class="brand">
          <span class="logo"></span>
          <span class="brand-name">多状态在线估计算法的边缘端硬件装置</span>
        </div>
        <nav id="navTabs" class="tabs">
          <div class="tab" @click="go('/')">实时监控</div>
          <div class="tab active" @click="go('/settings/soc')">系统设置</div>
        </nav>
        <div class="status">
          <span class="dot"></span>
          <span class="status-text">在线</span>
          <span class="update-time">最后更新 14:32:05</span>
        </div>
      </header>

      <div class="divider"></div>

      <!-- 内容区 -->
      <main class="content">
        <div id="settingTabs" class="setting-tabs">
          <button class="st active" @click="go('/settings/soc')">SOC 估算设置</button>
          <button class="st" @click="go('/settings/soe')">SOE 估算设置</button>
          <button class="st" @click="go('/settings/sop')">SOP 估算设置</button>
          <button class="st" @click="go('/settings/inconsistency')">不一致性估算设置</button>
          <button class="st" @click="go('/settings/alert')">预警估算设置</button>
        </div>

        <section class="panel">
          <div class="panel-title">
            <h1>SOC 估算设置</h1>
            <p>配置荷电状态估算的采样与参考参数</p>
          </div>
          <div class="panel-divider"></div>

          <div class="form">
            <div class="field fixed">
              <label>时间窗（点数）</label>
              <span class="hint">参与 SOC 滑动估算的采样点数量</span>
              <div
                class="input"
                :class="{ 'is-active': activeId === 'soc-window' }"
                data-soft-kb
                @mousedown.prevent
                @click.stop="edit('soc-window', '时间窗（点数）')"
              >
                <input
                  type="text"
                  :value="windowPoints"
                  readonly
                  inputmode="none"
                  tabindex="-1"
                  aria-label="时间窗（点数）"
                />
                <span class="unit">点</span>
              </div>
            </div>

            <div class="field fixed">
              <label>采样频率</label>
              <span class="hint">数据采集的时间间隔</span>
              <SelectField v-model="sampleFrequency" />
            </div>

            <div class="field">
              <label>是否参考当前 SOC</label>
              <span class="hint">开启后以当前 SOC 作为估算初值进行校正</span>
              <div class="toggle-row">
                <button
                  class="toggle"
                  :class="{ on: socOn }"
                  type="button"
                  aria-label="是否参考当前 SOC"
                  @click="socOn = !socOn"
                >
                  <span class="knob"></span>
                </button>
                <span class="toggle-label" :class="{ on: socOn }">{{
                  socOn ? '是（已开启）' : '否（已关闭）'
                }}</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <button class="btn-reset" type="button" @click="resetForm">重置</button>
            <button class="btn-save">保存设置</button>
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
const socOn = ref(true)
const fields = { 'soc-window': windowPoints }

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
  socOn.value = true
}
</script>

<style scoped>
.page {
  /* Converted from design fills (RGB 0~1 → hex) */
  --bg: #0f1d38; /* 页面底色 */
  --surface: #18294d; /* 顶栏 / 面板 */
  --card: #243b66; /* 未选中页签 / 表单卡片 */
  --card-active: #17386b; /* 选中的设置页签 */
  --accent: #29b6f6; /* 品牌青色 */
  --divider: #2a3f68; /* 分隔线 */
  --text: #fafafa; /* 主文本 */
  --text-dim: #a1a1aa; /* 次级文本 */
  --text-faint: #71717a; /* 弱化文本 */
  --green: #4cae50; /* 在线状态 */
  --input-bg: #35598a; /* 输入框底色 */
  --input-border: #6b8fc0; /* 输入框描边 */
  --border: #3f3f46; /* 按钮描边 */
  --on-accent: #0e0e10; /* 主按钮文字 */
  --font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
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
  overflow: hidden;
}

/* ===== 顶栏 ===== */
.top-bar {
  width: 100%;
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--surface);
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
  color: var(--text-dim);
  cursor: pointer;
  transition: color 0.15s ease;
  user-select: none;
}
.tab:hover {
  color: var(--text);
}
.tab.active {
  background: var(--card);
  color: var(--text);
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
  color: var(--text-dim);
}
.status .update-time {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-faint);
}

.divider {
  width: 100%;
  height: 1px;
  flex-shrink: 0;
  background: var(--divider);
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
  flex-shrink: 0;
}
.st {
  padding: 9px 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: var(--card);
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--text-dim);
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}
.st:hover {
  color: var(--text);
}
.st.active {
  background: var(--card-active);
  border-color: var(--accent);
  color: var(--accent);
  cursor: default;
}

.panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  background: var(--surface);
  border: 1px solid var(--divider);
  border-radius: 12px;
  overflow: hidden;
}
.panel-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.panel-title h1 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text);
}
.panel-title p {
  font-size: 13px;
  color: var(--text-dim);
}
.panel-divider {
  width: 100%;
  height: 1px;
  flex-shrink: 0;
  background: var(--divider);
}

.form {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 16px;
}
.field {
  width: calc(50% - 8px);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: var(--card);
  border-radius: 8px;
}
.field.fixed {
  height: 128px;
}
.field label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
}
.field .hint {
  font-size: 11px;
  color: var(--text-faint);
}

.input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 12px;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
}
.input input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
}
.input.is-active {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(41, 182, 246, 0.15);
}
.input .unit {
  font-size: 12px;
  color: var(--text-faint);
}

.dropdown {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 10px 0 12px;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  cursor: pointer;
}
.dropdown .value {
  font-size: 14px;
  color: var(--text);
}
.dropdown svg {
  flex-shrink: 0;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  border: none;
  border-radius: 12px;
  background: var(--border);
  cursor: pointer;
  transition: background 0.2s ease;
}
.toggle.on {
  background: var(--accent);
}
.toggle .knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background: #ffffff;
  transition: left 0.2s ease;
}
.toggle.on .knob {
  left: 23px;
}
.toggle-label {
  font-size: 13px;
  color: var(--text-dim);
}
.toggle-label.on {
  color: var(--green);
}

.footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
}
.btn-reset {
  padding: 10px 20px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: transparent;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--text-dim);
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}
.btn-reset:hover {
  color: var(--text);
  border-color: var(--text-dim);
}
.btn-save {
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background: var(--accent);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--on-accent);
  cursor: pointer;
  transition: filter 0.15s ease;
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
