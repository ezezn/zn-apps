<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  channelId: { type: String, required: true },
  source: { type: String, default: '' },
  playing: { type: Boolean, default: false },
  volume: { type: Number, default: 1 }
})

const emit = defineEmits(['source-change', 'play', 'pause', 'stop', 'error'])
const audioElement = ref(null)

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

onMounted(() => {
  if (audioElement.value) {
    audioElement.value.volume = Math.min(1, Math.max(0, props.volume))
    if (props.source && props.playing) start()
  }
})

watch(() => props.volume, (volume) => {
  if (audioElement.value) {
    audioElement.value.volume = Math.min(1, Math.max(0, volume))
  }
}, { flush: 'post' })

defineExpose({ start, pause, stop })
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
