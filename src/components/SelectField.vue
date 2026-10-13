<template>
  <div ref="rootRef" class="select-field" :class="{ open }">
    <button type="button" class="select-trigger" @click.stop="toggle">
      <span class="select-value">{{ modelValue }}</span>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M4.5 6.75L9 11.25L13.5 6.75"
          stroke="#A1A1AA"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <div v-if="open" class="select-menu" :class="{ up: openUp }">
      <button
        v-for="option in options"
        :key="option"
        type="button"
        class="select-option"
        :class="{ selected: option === modelValue }"
        @click.stop="choose(option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

const activeId = ref('')
let seq = 0
let listening = false

function nextSelectId() {
  return `select-${++seq}`
}

function ensureSelectListener() {
  if (listening) return
  listening = true
  document.addEventListener('click', (event) => {
    if (event.target.closest('.select-field')) return
    activeId.value = ''
  })
}
</script>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useSoftKeyboard } from '@/composables/useSoftKeyboard'

const props = defineProps({
  modelValue: { type: String, required: true },
  options: {
    type: Array,
    default: () => ['1 秒 / 点', '2 秒 / 点', '5 秒 / 点', '10 秒 / 点']
  }
})

const emit = defineEmits(['update:modelValue'])

const id = nextSelectId()
const rootRef = ref(null)
const openUp = ref(false)
const { hide: hideKeyboard } = useSoftKeyboard()
const open = computed(() => activeId.value === id)

function toggle() {
  hideKeyboard()
  if (open.value) {
    activeId.value = ''
    return
  }
  const rect = rootRef.value.getBoundingClientRect()
  const panel = rootRef.value.closest('.panel')
  const limit = panel ? panel.getBoundingClientRect().bottom : window.innerHeight
  const scale = rect.height / 40 || 1
  const menuHeight = props.options.length * 36 + 16
  openUp.value = (limit - rect.bottom) / scale < menuHeight
  activeId.value = id
}

function choose(option) {
  emit('update:modelValue', option)
  activeId.value = ''
}

onMounted(ensureSelectListener)

onUnmounted(() => {
  if (activeId.value === id) activeId.value = ''
})
</script>

<style scoped>
.select-field {
  position: relative;
  width: 100%;
}

.select-trigger {
  width: 100%;
  height: 40px;
  padding: 0 10px 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #6b8fc0;
  border-radius: 6px;
  background: #35598a;
  cursor: pointer;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.select-field.open .select-trigger {
  border-color: #29b6f6;
  box-shadow: 0 0 0 3px rgba(41, 182, 246, 0.15);
}

.select-value {
  font-size: 14px;
  color: #fafafa;
}

.select-trigger svg {
  flex: none;
  transition: transform 0.15s ease;
}

.select-field.open .select-trigger svg {
  transform: rotate(180deg);
}

.select-menu {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 6px);
  z-index: 30;
  padding: 4px;
  border: 1px solid #6b8fc0;
  border-radius: 8px;
  background: #18294d;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
}

.select-menu.up {
  top: auto;
  bottom: calc(100% + 6px);
}

.select-option {
  width: 100%;
  height: 36px;
  padding: 0 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  text-align: left;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 14px;
  color: #fafafa;
  cursor: pointer;
}

.select-option:hover,
.select-option.selected {
  background: #243b66;
  color: #29b6f6;
}
</style>
