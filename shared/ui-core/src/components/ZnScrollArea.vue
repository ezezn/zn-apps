<template>
  <div ref="rootRef" class="zn-scroll-area">
    <div
      ref="viewportRef"
      class="zn-scroll-area__viewport"
      :role="label ? 'region' : undefined"
      :aria-label="label || undefined"
      @scroll.passive="handleScroll"
    >
      <div ref="contentRef" class="zn-scroll-area__content">
        <slot />
      </div>
    </div>

    <div
      v-if="hasOverflow"
      class="zn-scroll-area__indicator"
      :class="{ 'zn-scroll-area__indicator--visible': isVisible }"
      aria-hidden="true"
    >
      <span
        class="zn-scroll-area__thumb"
        :style="{
          height: `${thumbHeight}px`,
          transform: `translateY(${thumbOffset}px)`
        }"
      />
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

defineProps({
  /** Accessible name for scrollable regions that need a landmark. */
  label: {
    type: String,
    default: ''
  }
})

const rootRef = ref(null)
const viewportRef = ref(null)
const contentRef = ref(null)
const hasOverflow = ref(false)
const isVisible = ref(false)
const thumbHeight = ref(0)
const thumbOffset = ref(0)

let resizeObserver
let hideTimer

function updateMetrics() {
  const viewport = viewportRef.value
  const root = rootRef.value
  if (!viewport || !root) return

  const railHeight = Math.max(0, root.clientHeight - 8)
  const scrollRange = viewport.scrollHeight - viewport.clientHeight
  hasOverflow.value = railHeight > 0 && scrollRange > 1

  if (!hasOverflow.value) {
    thumbHeight.value = 0
    thumbOffset.value = 0
    isVisible.value = false
    return
  }

  const minimumThumb = 28
  thumbHeight.value = Math.min(
    railHeight,
    Math.max(minimumThumb, (railHeight * viewport.clientHeight) / viewport.scrollHeight)
  )

  const thumbRange = railHeight - thumbHeight.value
  thumbOffset.value = (viewport.scrollTop / scrollRange) * thumbRange
}

function handleScroll() {
  updateMetrics()
  if (!hasOverflow.value) return

  isVisible.value = true
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    isVisible.value = false
  }, 850)
}

onMounted(async () => {
  await nextTick()
  updateMetrics()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(updateMetrics)
    if (viewportRef.value) resizeObserver.observe(viewportRef.value)
    if (contentRef.value) resizeObserver.observe(contentRef.value)
  } else {
    window.addEventListener('resize', updateMetrics)
  }
})

onUnmounted(() => {
  clearTimeout(hideTimer)
  resizeObserver?.disconnect()
  if (typeof ResizeObserver === 'undefined') {
    window.removeEventListener('resize', updateMetrics)
  }
})
</script>

<style scoped>
.zn-scroll-area {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.zn-scroll-area__viewport {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  overscroll-behavior: contain;
}

.zn-scroll-area__viewport::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.zn-scroll-area__content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.zn-scroll-area__indicator {
  position: absolute;
  z-index: 10;
  top: 4px;
  right: 4px;
  bottom: 4px;
  width: 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 240ms ease;
}

.zn-scroll-area__indicator--visible {
  opacity: 1;
}

.zn-scroll-area__thumb {
  display: block;
  width: 100%;
  border-radius: 999px;
  background: var(--md-outline);
  opacity: 0.72;
  transition: transform 60ms linear;
}

@media (prefers-reduced-motion: reduce) {
  .zn-scroll-area__indicator,
  .zn-scroll-area__thumb {
    transition: none;
  }
}
</style>
