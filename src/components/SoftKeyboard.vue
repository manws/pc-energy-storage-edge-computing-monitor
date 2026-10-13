<template>
  <div class="custom-keyboard" :class="{ 'is-open': kbOpen }" @mousedown.prevent @click.stop>
    <div class="kb-header">
      <span class="kb-hint">{{ hint }}</span>
      <button type="button" class="kb-done" @click="hide">完成</button>
    </div>
    <div class="keyboard-row">
      <div v-for="char in numbers" :key="char" class="key" @click="insertChar(char)">{{ char }}</div>
    </div>
    <div v-for="row in letterRows" :key="row" class="keyboard-row">
      <div
        v-for="char in row.split('')"
        :key="char"
        class="key"
        @click="insertChar(isUpperCase ? char.toUpperCase() : char)"
      >
        {{ isUpperCase ? char.toUpperCase() : char }}
      </div>
    </div>
    <div class="keyboard-row">
      <div class="key key-shift" :class="{ 'is-active': isUpperCase }" @click="isUpperCase = !isUpperCase">
        Shift
      </div>
      <div class="key key-space" @click="insertChar(' ')">空格</div>
      <div class="key key-backspace" @click="backspace">退格</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useSoftKeyboard } from '@/composables/useSoftKeyboard'

const {
  kbOpen,
  hint,
  isUpperCase,
  numbers,
  letterRows,
  hide,
  insertChar,
  backspace,
  shouldIgnoreDocClick
} = useSoftKeyboard()

function onDocClick(event) {
  if (!kbOpen.value || shouldIgnoreDocClick()) return
  if (event.target.closest('[data-soft-kb]') || event.target.closest('.custom-keyboard')) return
  hide()
}

function onFocusIn(event) {
  const field = event.target.closest?.('[data-soft-kb]')
  if (!field || !(event.target instanceof HTMLInputElement)) return
  event.target.blur()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('focusin', onFocusIn)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('focusin', onFocusIn)
  hide()
})
</script>

<style scoped>
.custom-keyboard {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  padding: 16px 24px 20px;
  border-radius: 16px 16px 0 0;
  background: rgba(12, 24, 48, 0.96);
  border-top: 1px solid rgba(41, 182, 246, 0.45);
  box-shadow:
    0 -12px 40px rgba(0, 0, 0, 0.45),
    0 -4px 24px rgba(41, 182, 246, 0.18);
  transform: translateY(110%);
  pointer-events: none;
  transition: transform 0.28s ease;
  user-select: none;
  -webkit-user-select: none;
}

.custom-keyboard.is-open {
  transform: translateY(0);
  pointer-events: auto;
}

.kb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.kb-hint {
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  color: #a1a1aa;
  letter-spacing: 0.5px;
}

.kb-done {
  height: 32px;
  padding: 0 16px;
  border: 1px solid #29b6f6;
  border-radius: 6px;
  background: rgba(41, 182, 246, 0.15);
  color: #29b6f6;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.kb-done:active {
  background: rgba(41, 182, 246, 0.3);
}

.keyboard-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  justify-content: center;
}

.custom-keyboard > .keyboard-row:last-child {
  margin-bottom: 0;
}

.key {
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(8, 18, 38, 0.85);
  border: 1px solid #2a3f68;
  border-radius: 8px;
  font-family: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace;
  font-size: 18px;
  font-weight: 500;
  color: #fafafa;
  cursor: pointer;
}

.key:active {
  background: rgba(41, 182, 246, 0.28);
  border-color: #29b6f6;
  box-shadow: 0 0 12px rgba(41, 182, 246, 0.35);
  color: #fff;
}

.key-shift,
.key-backspace {
  flex: 1.6;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
}

.key-space {
  flex: 4;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 15px;
  color: #a1a1aa;
}

.key-shift.is-active {
  background: rgba(41, 182, 246, 0.35);
  border-color: #29b6f6;
  color: #fff;
  box-shadow: 0 0 10px rgba(41, 182, 246, 0.4);
}
</style>
