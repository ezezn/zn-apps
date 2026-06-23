<template>
  <button class="shared-btn" @click="$emit('click', $event)">
    <slot>{{ label }}</slot>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Botón Compartido'
  }
})

defineEmits(['click'])
</script>

<style scoped>
.shared-btn {
  background-color: #42b883;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.shared-btn:hover {
  background-color: #35495e;
}

.shared-btn:active {
  transform: scale(0.98);
}
</style>
