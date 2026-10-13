<template>
  <div class="viewport">
    <div class="frame">
      <slot />
      <SoftKeyboard />
    </div>
  </div>
</template>

<script setup>
import SoftKeyboard from '@/components/SoftKeyboard.vue'
</script>

<style scoped>
.viewport {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: #070d1a;
}

.frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
