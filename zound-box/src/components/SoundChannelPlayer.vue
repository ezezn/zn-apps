<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  channelId: { type: String, required: true },
  source: { type: String, default: '' },
  playing: { type: Boolean, default: false },
  volume: { type: Number, default: 1 }
})

const emit = defineEmits(['source-change', 'play', 'pause', 'stop', 'error'])
const audioElement = ref(null)

let intervalId = null

function resetTime() {
  if (audioElement.value) {
    audioElement.value.currentTime = 0
  }
}

async function start() {
  if (!audioElement.value || !props.source) return

  try {
    await audioElement.value.play()
    emit('play', props.channelId)
  } catch (error) {
    emit('error', { channelId: props.channelId, error })
  }
}

function pause() {
  if (!audioElement.value) return
  audioElement.value.pause()
  emit('pause', props.channelId)
}

function stop() {
  if (!audioElement.value) return
  audioElement.value.pause()
  audioElement.value.currentTime = 0
  emit('stop', props.channelId)
}

watch(() => [props.source, props.playing], async ([source, playing], [previousSource, previousPlaying] = []) => {
  if (source !== previousSource) {
    stop()
    if (source) audioElement.value?.load()
    emit('source-change', { channelId: props.channelId, source })
  }

  if (source && playing && (source !== previousSource || !previousPlaying)) {
    await start()
  } else if (!playing && previousPlaying && source === previousSource) {
    pause()
  }
}, { flush: 'post', immediate: true })

watch(() => props.volume, (volume) => {
  if (audioElement.value) {
    audioElement.value.volume = Math.min(1, Math.max(0, volume))
  }
}, { flush: 'post' })

onMounted(() => {
  if (audioElement.value) {
    audioElement.value.volume = Math.min(1, Math.max(0, props.volume))
    if (props.source && props.playing) start()
  }

  intervalId = setInterval(() => {
    if (!audioElement.value || !props.playing) return
    if (audioElement.value.currentTime >= audioElement.value.duration) {
      resetTime()
    }
  }, 250)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

defineExpose({ start, pause, stop, resetTime })
</script>

<template>
  <audio
    ref="audioElement"
    class="sound-channel-player"
    :src="source || undefined"
    :data-channel="channelId"
    :volume="volume"
    preload="auto"
    loop
    aria-hidden="true"
    tabindex="-1"
  />
</template>

<style scoped>
.sound-channel-player {
  display: none;
}
</style>
