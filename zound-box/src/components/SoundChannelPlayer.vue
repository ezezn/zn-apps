<script setup>
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  channelId: { type: String, required: true },
  source: { type: String, default: '' },
  playing: { type: Boolean, default: false },
  volume: { type: Number, default: 1 },
  loopStart: { type: Number, default: 0 },
  loopEnd: { type: Number, default: null }
})

const emit = defineEmits(['source-change', 'play', 'pause', 'stop', 'error'])
const audioElement = ref(null)

const renderedSource = ref(props.source)
let isPlayingAudio = false
let isFinishingFadeOut = false

function hasSeamlessLoop() {
  return Number.isFinite(props.loopEnd) && props.loopEnd > props.loopStart
}

function onTimeUpdate() {
  const audio = audioElement.value
  if (!audio || isFinishingFadeOut || !props.playing || !hasSeamlessLoop()) return
  if (audio.currentTime >= props.loopEnd) audio.currentTime = props.loopStart
}

function finishFadeOut() {
  if (!isFinishingFadeOut) return
  isFinishingFadeOut = false
  isPlayingAudio = false
  if (audioElement.value) {
    audioElement.value.pause()
    audioElement.value.currentTime = 0
  }
  renderedSource.value = ''
  emit('stop', props.channelId)
}

function resetTime() {
  if (audioElement.value) {
    audioElement.value.currentTime = 0
  }
}

async function start(allowEmptySource = false) {
  if (!audioElement.value || (!props.source && !allowEmptySource)) return

  try {
    await audioElement.value.play()
    isPlayingAudio = true
    emit('play', props.channelId)
  } catch (error) {
    isPlayingAudio = false
    emit('error', { channelId: props.channelId, error })
  }
}

function pause() {
  if (!audioElement.value) return
  audioElement.value.pause()
  isPlayingAudio = false
  emit('pause', props.channelId)
}

function stop() {
  if (!audioElement.value) return
  isFinishingFadeOut = false
  isPlayingAudio = false
  audioElement.value.pause()
  audioElement.value.currentTime = 0
  renderedSource.value = ''
  emit('stop', props.channelId)
}

watch(() => [props.source, props.playing, props.loopStart, props.loopEnd], async ([source, playing], [previousSource, previousPlaying] = []) => {
  if (source !== previousSource) {
    if (!source && previousSource && isPlayingAudio && hasSeamlessLoop()) {
      isFinishingFadeOut = true
      audioElement.value.currentTime = props.loopEnd
      await start(true)
    } else {
      stop()
      renderedSource.value = source
      if (source) audioElement.value?.load()
    }
    emit('source-change', { channelId: props.channelId, source })
  }

  if (source && playing && (source !== previousSource || !previousPlaying)) {
    isFinishingFadeOut = false
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

})

defineExpose({ start, pause, stop, resetTime })
</script>

<template>
  <audio
    ref="audioElement"
    class="sound-channel-player"
    :src="renderedSource || undefined"
    :data-channel="channelId"
    :volume="volume"
    preload="auto"
    :loop="!hasSeamlessLoop()"
    @timeupdate="onTimeUpdate"
    @ended="finishFadeOut"
    aria-hidden="true"
    tabindex="-1"
  />
</template>

<style scoped>
.sound-channel-player {
  display: none;
}
</style>
