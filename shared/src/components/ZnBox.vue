<template>
  <div :class="['zn-box', `zn-box--${variant}`]">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'filled',
    validator: (value) => ['filled', 'elevated', 'outlined'].includes(value)
  }
})
</script>

<style scoped>
.zn-box {
  position: relative;
  border-radius: 12px; /* M3 Medium Container Radius Token */
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
}

/* Variante Filled (Superficie Tonal Plana) */
.zn-box--filled {
  background-color: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
}

/* Variante Elevated (Superficie con elevación por sombra ligera) */
.zn-box--elevated {
  background-color: var(--md-surface);
  color: var(--md-on-background);
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24);
}

/* Variante Outlined (Limpia con borde fino perimetral) */
.zn-box--outlined {
  background-color: var(--md-surface);
  color: var(--md-on-background);
  border: 1px solid var(--md-outline);
}
</style>