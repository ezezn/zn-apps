<template>
  <DemoView view="dashlets-data">
    <ZnSection
      v-for="example in dashletExamples"
      :key="example.key"
      :title="example.title"
      collapsible
      :columns="2"
    >
      <p class="section-desc section-desc--full">{{ example.description }}</p>

      <div class="chart-payload">
        <span class="showcase-label">data</span>
        <pre class="json-dump">{{ toJson(example.data) }}</pre>
      </div>
      <div class="chart-payload">
        <span class="showcase-label">config</span>
        <pre class="json-dump">{{ toJson(example.config) }}</pre>
      </div>
    </ZnSection>

    <ZnSection title="Miniaturas de dashlet" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Las miniaturas de dashlet usan el componente <code>ZnDashlet</code> con el mismo
        <code>data</code> y <code>config</code>, pero dibujan una versión reducida:
        sin interacción compleja, ideales para cards de summary.
      </p>

      <div v-for="shape in shapeExamples" :key="shape.key" class="chart-payload">
        <span class="showcase-label">{{ shape.label }} · data y config</span>
        <pre class="json-dump">{{ toJson(shape.data) }}</pre>
        <pre class="json-dump">{{ toJson(shape.config) }}</pre>
      </div>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ZnSection } from '@zn-apps/ui-core'
import DemoView from '../../components/DemoView.vue'
import { dashletExamples, shapeExamples } from '../../data/dashlets-demo.js'

const toJson = (value) => JSON.stringify(value, null, 2)
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.showcase-label {
  display: block;
  margin-bottom: 6px;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.chart-payload {
  min-width: 0;
}

.json-dump {
  overflow-x: auto;
  max-height: 320px;
  margin: 0 0 8px;
  padding: 12px;
  border-radius: 8px;
  background: var(--md-surface-container-low);
  color: var(--md-on-background);
  font-family: monospace;
  font-size: 0.8125rem;
  line-height: 1.5;
}
</style>