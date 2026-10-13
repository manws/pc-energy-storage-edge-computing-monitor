<template>
  <StageFrame>
    <div id="stage" class="page">
      <header class="topbar">
        <div class="brand">
          <div class="brand-logo"></div>
          <span class="brand-name">储能 · 边缘计算监控系统</span>
        </div>
        <nav class="top-tabs">
          <div class="top-tab" @click="go('/')">实时监控</div>
          <div class="top-tab active" @click="go('/settings/soc')">系统设置</div>
        </nav>
        <div class="status">
          <span class="status-dot"></span>
          <span class="status-text">在线</span>
          <span class="status-time">最后更新 14:32:05</span>
        </div>
      </header>

      <div class="topbar-divider"></div>

      <main class="content">
        <nav class="setting-tabs">
          <div class="setting-tab" @click="go('/settings/soc')">SOC 估算设置</div>
          <div class="setting-tab" @click="go('/settings/soe')">SOE 估算设置</div>
          <div class="setting-tab" @click="go('/settings/sop')">SOP 估算设置</div>
          <div class="setting-tab" @click="go('/settings/inconsistency')">不一致性估算设置</div>
          <div class="setting-tab active" @click="go('/settings/alert')">预警估算设置</div>
        </nav>

        <section class="panel">
          <div class="panel-head">
            <h1 class="panel-title">预警估算设置</h1>
            <p class="panel-sub">配置绝缘电阻与内阻异常的检测与报警参数</p>
          </div>

          <div class="panel-divider"></div>

          <div class="form">
            <section class="group">
              <div class="group-head">
                <span class="group-dot"></span>
                <h2 class="group-title">绝缘电阻异常检测</h2>
              </div>
              <div class="fields">
                <div class="field">
                  <label class="field-label">时间窗（点数）</label>
                  <div
                    class="input"
                    :class="{ 'is-active': activeId === 'insulation-window' }"
                    data-soft-kb
                    @mousedown.prevent
                    @click.stop="edit('insulation-window', '绝缘电阻时间窗（点数）')"
                  >
                    <input
                      class="input-value mono"
                      type="text"
                      :value="insulationWindow"
                      readonly
                      inputmode="none"
                      tabindex="-1"
                      aria-label="绝缘电阻时间窗（点数）"
                    />
                    <span class="input-unit">点</span>
                  </div>
                </div>
                <div class="field">
                  <label class="field-label">采样频率</label>
                  <SelectField v-model="insulationFrequency" />
                </div>
                <div class="field">
                  <label class="field-label">报警阈值（默认 1.0）</label>
                  <div
                    class="input"
                    :class="{ 'is-active': activeId === 'insulation-threshold' }"
                    data-soft-kb
                    @mousedown.prevent
                    @click.stop="edit('insulation-threshold', '绝缘电阻报警阈值')"
                  >
                    <input
                      class="input-value mono accent"
                      type="text"
                      :value="insulationThreshold"
                      readonly
                      inputmode="none"
                      tabindex="-1"
                      aria-label="绝缘电阻报警阈值"
                    />
                    <span class="input-unit">MΩ</span>
                  </div>
                </div>
              </div>
            </section>

            <section class="group">
              <div class="group-head">
                <span class="group-dot"></span>
                <h2 class="group-title">内阻异常检测</h2>
              </div>
              <div class="fields">
                <div class="field">
                  <label class="field-label">时间窗（点数）</label>
                  <div
                    class="input"
                    :class="{ 'is-active': activeId === 'resistance-window' }"
                    data-soft-kb
                    @mousedown.prevent
                    @click.stop="edit('resistance-window', '内阻时间窗（点数）')"
                  >
                    <input
                      class="input-value mono"
                      type="text"
                      :value="resistanceWindow"
                      readonly
                      inputmode="none"
                      tabindex="-1"
                      aria-label="内阻时间窗（点数）"
                    />
                    <span class="input-unit">点</span>
                  </div>
                </div>
                <div class="field">
                  <label class="field-label">采样频率</label>
                  <SelectField v-model="resistanceFrequency" />
                </div>
                <div class="field">
                  <label class="field-label">报警阈值（默认 0.7）</label>
                  <div
                    class="input"
                    :class="{ 'is-active': activeId === 'resistance-threshold' }"
                    data-soft-kb
                    @mousedown.prevent
                    @click.stop="edit('resistance-threshold', '内阻报警阈值')"
                  >
                    <input
                      class="input-value mono accent"
                      type="text"
                      :value="resistanceThreshold"
                      readonly
                      inputmode="none"
                      tabindex="-1"
                      aria-label="内阻报警阈值"
                    />
                    <span class="input-unit">mΩ</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div class="panel-footer">
            <button class="btn btn-reset" type="button" @click="resetForm">重置</button>
            <button class="btn btn-save">保存设置</button>
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

const insulationWindow = ref('60')
const insulationFrequency = ref('1 秒 / 点')
const insulationThreshold = ref('1.0')
const resistanceWindow = ref('60')
const resistanceFrequency = ref('1 秒 / 点')
const resistanceThreshold = ref('0.7')
const fields = {
  'insulation-window': insulationWindow,
  'insulation-threshold': insulationThreshold,
  'resistance-window': resistanceWindow,
  'resistance-threshold': resistanceThreshold
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
  insulationWindow.value = '60'
  insulationFrequency.value = '1 秒 / 点'
  insulationThreshold.value = '1.0'
  resistanceWindow.value = '60'
  resistanceFrequency.value = '1 秒 / 点'
  resistanceThreshold.value = '0.7'
}
</script>

<style scoped>
.page {
  --bg: #0f1d38; /* 页面底色 */
  --bar: #18294d; /* 顶栏 / 面板 */
  --divider: #2a3f68; /* 分隔线 / 面板描边 */
  --pill: #243b66; /* 未激活标签 / 字段卡 */
  --pill-active: #17386b; /* 激活设置标签底 */
  --input-bg: #35598a; /* 输入框底 */
  --input-border: #6b8fc0; /* 输入框 / 重置按钮描边 */
  --accent: #29b6f6; /* 主色蓝 */
  --yellow: #f2c94c; /* 分组圆点 / 阈值数值 */
  --green: #4caf50; /* 在线状态点 */
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  --text-label: #e4e4e7;
  --font-sans: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  --font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, 'Noto Sans SC', monospace;
}

* {
  box-sizing: border-box;
}

#stage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow: hidden;
}

/* ===== 顶栏 ===== */
.topbar {
  flex: none;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--bar);
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
  background: var(--accent);
}
.brand-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.top-tabs {
  display: flex;
  gap: 4px;
}
.top-tab {
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: color 0.15s ease;
}
.top-tab:hover {
  color: var(--text-primary);
}
.top-tab.active {
  background: var(--pill);
  color: var(--text-primary);
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
  color: var(--text-secondary);
}
.status-time {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--text-muted);
}

.topbar-divider {
  flex: none;
  height: 1px;
  background: var(--divider);
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

.setting-tabs {
  display: flex;
  gap: 8px;
}
.setting-tab {
  padding: 9px 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: var(--pill);
  cursor: pointer;
  transition: background 0.15s ease;
}
.setting-tab:hover {
  background: #2c446f;
}
.setting-tab.active {
  background: var(--pill-active);
  border-color: var(--accent);
  color: var(--accent);
  cursor: default;
}

.panel {
  flex: 1;
  min-height: 0;
  background: var(--bar);
  border: 1px solid var(--divider);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.panel-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}
.panel-sub {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}

.panel-divider {
  flex: none;
  height: 1px;
  background: #27272a;
}

.form {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.group-head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.group-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: var(--yellow);
}
.group-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.fields {
  display: flex;
  gap: 16px;
}
.field {
  flex: 1;
  background: var(--pill);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-label);
}

.input {
  height: 38px;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
}
.input-select {
  padding-right: 10px;
}
.input-value {
  font-size: 14px;
  color: var(--text-primary);
}
.input input.input-value {
  flex: 1;
  min-width: 0;
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  cursor: pointer;
}
.input.is-active {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(41, 182, 246, 0.15);
}
.input-value.mono {
  font-family: var(--font-mono);
  font-weight: 500;
}
.input-value.accent {
  color: var(--yellow);
}
.input-unit {
  font-size: 12px;
  color: var(--text-muted);
}
.chevron {
  flex: none;
  display: block;
}

.panel-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn {
  border: none;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition:
    filter 0.15s ease,
    background 0.15s ease;
}
.btn-reset {
  padding: 10px 20px;
  background: transparent;
  border: 1px solid var(--input-border);
  color: var(--text-secondary);
}
.btn-reset:hover {
  background: rgba(63, 63, 70, 0.25);
  color: var(--text-primary);
}
.btn-save {
  padding: 10px 24px;
  background: var(--accent);
  color: #0e0e10;
}
.btn-save:hover {
  filter: brightness(1.08);
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
