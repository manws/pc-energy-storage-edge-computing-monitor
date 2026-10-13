<template>
  <div class="viewport">
    <div class="frame" :style="{ transform: `scale(${scale})` }">
      <slot />
      <SoftKeyboard />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import SoftKeyboard from '@/components/SoftKeyboard.vue'

const DESIGN_W = 1280
const DESIGN_H = 800
const scale = ref(1)

function fit() {
  scale.value = Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H)
}

onMounted(() => {
  fit()
  window.addEventListener('resize', fit)
})

onUnmounted(() => {
  window.removeEventListener('resize', fit)
})
</script>

<style scoped>
.viewport {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #070d1a;
}

.frame {
  position: relative;
  width: 1280px;
  height: 800px;
  flex: none;
  transform-origin: center center;
}
</style>
