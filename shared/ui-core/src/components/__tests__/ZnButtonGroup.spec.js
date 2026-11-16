import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnButton from '../controls/ZnButton.vue'
import ZnButtonGroup from '../controls/ZnButtonGroup.vue'

describe('ZnButtonGroup & ZnButton toggle mode', () => {
  it('permite a ZnButton funcionar en modo toggle individual con v-model:selected', async () => {
    const wrapper = mount(ZnButton, {
      props: {
        toggle: true,
        selected: false
      },
      slots: {
        default: 'Toggle Me'
      }
    })

    expect(wrapper.classes()).toContain('zn-button--toggle')
    expect(wrapper.classes()).not.toContain('zn-button--selected')
    expect(wrapper.attributes('aria-pressed')).toBe('false')

    await wrapper.trigger('click')
    expect(wrapper.emitted('update:selected')).toBeTruthy()
    expect(wrapper.emitted('update:selected')[0]).toEqual([true])
  })

  it('renderiza ZnButtonGroup agrupando botones y propagando variante outlined por defecto', () => {
    const wrapper = mount(ZnButtonGroup, {
      slots: {
        default: `
          <button class="zn-button zn-button--outlined">One</button>
          <button class="zn-button zn-button--outlined">Two</button>
        `
      }
    })

    expect(wrapper.classes()).toContain('zn-button-group')
    expect(wrapper.classes()).toContain('zn-button-group--outlined')
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('gestiona selección única con ZnButtonGroup y botones hijos con value', async () => {
    const TestComponent = {
      components: { ZnButtonGroup, ZnButton },
      data() {
        return { selected: 'b' }
      },
      template: `
        <ZnButtonGroup v-model="selected">
          <ZnButton value="a">A</ZnButton>
          <ZnButton value="b">B</ZnButton>
          <ZnButton value="c">C</ZnButton>
        </ZnButtonGroup>
      `
    }

    const wrapper = mount(TestComponent)
    const buttons = wrapper.findAllComponents(ZnButton)

    expect(buttons[0].classes()).not.toContain('zn-button--selected')
    expect(buttons[1].classes()).toContain('zn-button--selected')
    expect(buttons[2].classes()).not.toContain('zn-button--selected')

    await buttons[0].trigger('click')
    expect(wrapper.vm.selected).toBe('a')
    expect(buttons[0].classes()).toContain('zn-button--selected')
    expect(buttons[1].classes()).not.toContain('zn-button--selected')
  })

  it('gestiona selección múltiple cuando multiple=true', async () => {
    const TestComponent = {
      components: { ZnButtonGroup, ZnButton },
      data() {
        return { selected: ['a'] }
      },
      template: `
        <ZnButtonGroup v-model="selected" multiple>
          <ZnButton value="a">A</ZnButton>
          <ZnButton value="b">B</ZnButton>
        </ZnButtonGroup>
      `
    }

    const wrapper = mount(TestComponent)
    const buttons = wrapper.findAllComponents(ZnButton)

    expect(buttons[0].classes()).toContain('zn-button--selected')
    expect(buttons[1].classes()).not.toContain('zn-button--selected')

    await buttons[1].trigger('click')
    expect(wrapper.vm.selected).toEqual(['a', 'b'])
    expect(buttons[0].classes()).toContain('zn-button--selected')
    expect(buttons[1].classes()).toContain('zn-button--selected')
  })
})
