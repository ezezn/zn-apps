import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import ButtonsPage from '../views/ButtonsPage.vue'
import CardsPage from '../views/CardsPage.vue'
import SwitchesPage from '../views/SwitchesPage.vue'
import IconsPage from '../views/IconsPage.vue'
import LayoutPage from '../views/LayoutPage.vue'
import SectionsPage from '../views/SectionsPage.vue'
import ScreenPage from '../views/ScreenPage.vue'
import NavigationLayoutPage from '../views/NavigationLayoutPage.vue'
import LegacyPage from '../views/LegacyPage.vue'
import DialogsPage from '../views/DialogsPage.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', redirect: '/buttons' },
      { path: '/buttons', name: 'buttons', component: ButtonsPage },
      { path: '/cards', name: 'cards', component: CardsPage },
      { path: '/switches', name: 'switches', component: SwitchesPage },
      { path: '/dialogs', name: 'dialogs', component: DialogsPage },
      { path: '/icons', name: 'icons', component: IconsPage },
      { path: '/layout', name: 'layout', component: LayoutPage },
      { path: '/sections', name: 'sections', component: SectionsPage },
      { path: '/screen', name: 'screen', component: ScreenPage },
      { path: '/navigation-layout', name: 'navigation-layout', component: NavigationLayoutPage },
      { path: '/legacy', name: 'legacy', component: LegacyPage }
    ]
  })
}

async function mountAt(path) {
  const router = createTestRouter()
  router.push(path)
  await router.isReady()

  return mount(App, {
    global: {
      plugins: [router]
    }
  })
}

describe('Kitchensink App & Router', () => {
  it('renderiza la barra lateral con enlaces de navegación', async () => {
    const wrapper = await mountAt('/buttons')

    expect(wrapper.text()).toContain('ZnComponents Hub')
    expect(wrapper.text()).toContain('Botones (ZnButton)')
    expect(wrapper.text()).toContain('Tarjetas (ZnCard)')
    expect(wrapper.text()).toContain('Selectores (ZnSwitch)')
    expect(wrapper.text()).toContain('Diálogos (ZnDialog)')
    expect(wrapper.text()).toContain('Iconos (ZnIcon)')
    expect(wrapper.text()).toContain('Layout (ZnBox / ZnRow)')
    expect(wrapper.text()).toContain('Secciones (ZnSection)')
    expect(wrapper.text()).toContain('Pantallas (ZnScreen)')
    expect(wrapper.text()).toContain('Navegación (ZnMasterSlaveLayout)')
    expect(wrapper.text()).toContain('Utilidades')
  })

  it('navega a la vista de Cards al cambiar de ruta', async () => {
    const wrapper = await mountAt('/cards')

    expect(wrapper.findComponent(CardsPage).exists()).toBe(true)
  })

  it('navega a la vista de Switches al cambiar de ruta', async () => {
    const wrapper = await mountAt('/switches')

    expect(wrapper.findComponent(SwitchesPage).exists()).toBe(true)
  })

  it('navega a la vista de diálogos al cambiar de ruta', async () => {
    const wrapper = await mountAt('/dialogs')

    expect(wrapper.findComponent(DialogsPage).exists()).toBe(true)
  })

  it('navega a la vista de Icons al cambiar de ruta', async () => {
    const wrapper = await mountAt('/icons')

    expect(wrapper.findComponent(IconsPage).exists()).toBe(true)
  })

  it('navega a la vista de Layout al cambiar de ruta', async () => {
    const wrapper = await mountAt('/layout')

    expect(wrapper.findComponent(LayoutPage).exists()).toBe(true)
  })

  it('navega a la vista de Sections al cambiar de ruta', async () => {
    const wrapper = await mountAt('/sections')

    expect(wrapper.findComponent(SectionsPage).exists()).toBe(true)
  })

  it('navega a la vista de Screen al cambiar de ruta', async () => {
    const wrapper = await mountAt('/screen')

    expect(wrapper.findComponent(ScreenPage).exists()).toBe(true)
  })

  it('navega a la vista de NavigationLayout al cambiar de ruta', async () => {
    const wrapper = await mountAt('/navigation-layout')

    expect(wrapper.findComponent(NavigationLayoutPage).exists()).toBe(true)
  })

  it('navega a la vista legacy al cambiar de ruta', async () => {
    const wrapper = await mountAt('/legacy')

    expect(wrapper.findComponent(LegacyPage).exists()).toBe(true)
  })
})
