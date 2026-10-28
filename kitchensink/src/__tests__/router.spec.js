import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import ButtonsPage from '../views/ButtonsPage.vue'
import CardsPage from '../views/CardsPage.vue'
import SwitchesPage from '../views/SwitchesPage.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', redirect: '/buttons' },
      { path: '/buttons', name: 'buttons', component: ButtonsPage },
      { path: '/cards', name: 'cards', component: CardsPage },
      { path: '/switches', name: 'switches', component: SwitchesPage }
    ]
  })
}

describe('Kitchensink App & Router', () => {
  it('renderiza la barra lateral con enlaces de navegación', async () => {
    const router = createTestRouter()
    router.push('/buttons')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('ZnComponents Hub')
    expect(wrapper.text()).toContain('Botones (ZnButton)')
    expect(wrapper.text()).toContain('Tarjetas (ZnCard)')
    expect(wrapper.text()).toContain('Selectores (ZnSwitch)')
  })

  it('navega a la vista de Cards al cambiar de ruta', async () => {
    const router = createTestRouter()
    router.push('/cards')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('Tarjetas (ZnCard)')
    expect(wrapper.findComponent(CardsPage).exists()).toBe(true)
  })

  it('navega a la vista de Switches al cambiar de ruta', async () => {
    const router = createTestRouter()
    router.push('/switches')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.findComponent(SwitchesPage).exists()).toBe(true)
  })
})
