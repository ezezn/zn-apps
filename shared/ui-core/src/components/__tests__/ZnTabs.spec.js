import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnTabs from '../navigation/ZnTabs.vue'

const tabs = [
  { value: 'first', label: 'Primera', content: 'Contenido uno' },
  { value: 'disabled', label: 'Deshabilitada', disabled: true },
  { value: 'second', label: 'Segunda', content: 'Contenido dos' }
]

describe('ZnTabs', () => {
  it('selecciona el primer tab habilitado y muestra su panel', () => {
    const wrapper = mount(ZnTabs, { props: { tabs } })

    expect(wrapper.find('[role="tab"][aria-selected="true"]').text()).toBe('Primera')
    expect(wrapper.find('[role="tabpanel"]:not([hidden])').text()).toContain('Contenido uno')
  })

  it('sincroniza v-model al activar otro tab y vincula tabs con paneles', async () => {
    const wrapper = mount(ZnTabs, { props: { tabs, modelValue: 'first' } })
    const secondTab = wrapper.findAll('[role="tab"]')[2]

    await secondTab.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([['second']])
    expect(wrapper.emitted('change')).toEqual([['second']])
    await wrapper.setProps({ modelValue: 'second' })
    expect(secondTab.attributes('aria-controls')).toBe(wrapper.find('[role="tabpanel"]:not([hidden])').attributes('id'))
  })

  it('en modo no controlado cambia con las flechas y salta tabs deshabilitados', async () => {
    const wrapper = mount(ZnTabs, { props: { tabs } })
    const firstTab = wrapper.findAll('[role="tab"]')[0]

    await firstTab.trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.find('[role="tab"][aria-selected="true"]').text()).toBe('Segunda')
    expect(wrapper.find('[role="tabpanel"]:not([hidden])').text()).toContain('Contenido dos')
  })

  it('expone el estilo secundario y respeta la selección controlada', async () => {
    const wrapper = mount(ZnTabs, { props: { tabs, modelValue: 'second', variant: 'secondary' } })

    expect(wrapper.classes()).toContain('zn-tabs--secondary')
    await wrapper.findAll('[role="tab"]')[0].trigger('click')
    expect(wrapper.find('[role="tab"][aria-selected="true"]').text()).toBe('Segunda')
    expect(wrapper.emitted('update:modelValue')).toEqual([['first']])
  })
})
