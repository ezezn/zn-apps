import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { routes } from '../router/index.js'
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
import TabsPage from '../views/TabsPage.vue'
import AboutPage from '../views/AboutPage.vue'
import ColorSchemePage from '../views/ColorSchemePage.vue'
import PwaMetaPage from '../views/PwaMetaPage.vue'
import PwaInstallPage from '../views/PwaInstallPage.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes
  })
}

async function mountAt(path) {
  const router = createTestRouter()
  router.push(path)
  await router.isReady()

  const wrapper = mount(App, {
    global: {
      plugins: [router]
    }
  })
  return { wrapper, router }
}

function findGroupHeader(wrapper, label) {
  return wrapper
    .findAll('.nav-group-header')
    .find((node) => node.text().includes(label))
}

describe('Kitchensink App & Router', () => {
  it('renderiza la barra lateral con enlaces de navegación', async () => {
    const { wrapper } = await mountAt('/buttons')

    expect(wrapper.text()).toContain('ZnComponents Hub')
    expect(wrapper.text()).toContain('Buttons (ZnButton)')
    expect(wrapper.text()).toContain('Cards (ZnCard)')
    expect(wrapper.text()).toContain('Switches (ZnSwitch)')
    expect(wrapper.text()).toContain('Dialogs (ZnDialog)')
    expect(wrapper.text()).toContain('Icons (ZnIcon)')
    expect(wrapper.text()).toContain('Layout (ZnBox / ZnRow)')
    expect(wrapper.text()).toContain('Sections (ZnSection)')
    expect(wrapper.text()).toContain('Screens (ZnScreen)')
    expect(wrapper.text()).toContain('Tabs (ZnTabs)')
    expect(wrapper.text()).toContain('Master layout (ZnMasterSlaveLayout)')
    expect(wrapper.text()).toContain('Utilities')
    expect(wrapper.text()).toContain('About app (ZnAbout)')
  })

  it('agrupa la navegación por librería con subsecciones', async () => {
    const { wrapper } = await mountAt('/buttons')

    expect(wrapper.text()).toContain('@zn-apps/ui-core')
    expect(wrapper.text()).toContain('@zn-apps/ui-about')
    expect(wrapper.text()).toContain('@zn-apps/pwa-integration')

    // Subsecciones de ui-core
    expect(wrapper.text()).toContain('Navigation')
    expect(wrapper.text()).toContain('Layout')
    expect(wrapper.text()).toContain('Controls')
    expect(wrapper.text()).toContain('Resources and utilities')

    // Subsecciones de pwa-integration
    expect(wrapper.text()).toContain('Theme and bars')
    expect(wrapper.text()).toContain('Installation')
  })

  it('colapsa y expande grupos desde el encabezado', async () => {
    const { wrapper } = await mountAt('/buttons')

    const coreHeader = findGroupHeader(wrapper, '@zn-apps/ui-core')
    const coreBody = () => wrapper.findAll('.nav-group-body')[0]

    expect(coreHeader.attributes('aria-expanded')).toBe('true')
    expect(coreBody().element.style.display).toBe('')

    await coreHeader.trigger('click')

    expect(coreHeader.attributes('aria-expanded')).toBe('false')
    expect(coreBody().element.style.display).toBe('none')

    await coreHeader.trigger('click')

    expect(coreHeader.attributes('aria-expanded')).toBe('true')
    expect(coreBody().element.style.display).toBe('')
  })

  it('re-expande automáticamente el grupo de la vista activa', async () => {
    const { wrapper, router } = await mountAt('/buttons')

    const coreHeader = findGroupHeader(wrapper, '@zn-apps/ui-core')
    await coreHeader.trigger('click')
    expect(coreHeader.attributes('aria-expanded')).toBe('false')

    await router.push('/pwa/install')
    await wrapper.vm.$nextTick()

    expect(findGroupHeader(wrapper, '@zn-apps/pwa-integration').attributes('aria-expanded')).toBe('true')
    expect(coreHeader.attributes('aria-expanded')).toBe('false')

    await router.push('/sections')
    await wrapper.vm.$nextTick()

    expect(coreHeader.attributes('aria-expanded')).toBe('true')
  })

  it('permite cambiar la preferencia de tema desde el menú', async () => {
    const { wrapper } = await mountAt('/buttons')

    const darkOption = wrapper
      .findAll('.nav-theme-options button')
      .find((node) => node.text().includes('Dark'))
    expect(darkOption).toBeTruthy()

    await darkOption.trigger('click')

    expect(wrapper.find('.zn-app-root').classes()).toContain('zn-theme-dark')
  })

  it('navega a la vista de Cards al cambiar de ruta', async () => {
    const { wrapper } = await mountAt('/cards')

    expect(wrapper.findComponent(CardsPage).exists()).toBe(true)
  })

  it('navega a la vista de Switches al cambiar de ruta', async () => {
    const { wrapper } = await mountAt('/switches')

    expect(wrapper.findComponent(SwitchesPage).exists()).toBe(true)
  })

  it('navega a la vista de diálogos al cambiar de ruta', async () => {
    const { wrapper } = await mountAt('/dialogs')

    expect(wrapper.findComponent(DialogsPage).exists()).toBe(true)
  })

  it('navega a la vista de Icons al cambiar de ruta', async () => {
    const { wrapper } = await mountAt('/icons')

    expect(wrapper.findComponent(IconsPage).exists()).toBe(true)
  })

  it('navega a la vista de Layout al cambiar de ruta', async () => {
    const { wrapper } = await mountAt('/layout')

    expect(wrapper.findComponent(LayoutPage).exists()).toBe(true)
  })

  it('navega a la vista de Sections al cambiar de ruta', async () => {
    const { wrapper } = await mountAt('/sections')

    expect(wrapper.findComponent(SectionsPage).exists()).toBe(true)
  })

  it('navega a la vista de Screen al cambiar de ruta', async () => {
    const { wrapper } = await mountAt('/screen')

    expect(wrapper.findComponent(ScreenPage).exists()).toBe(true)
  })

  it('navega a la vista de Tabs al cambiar de ruta', async () => {
    const { wrapper } = await mountAt('/tabs')

    expect(wrapper.findComponent(TabsPage).exists()).toBe(true)
    expect(wrapper.text()).toContain('Pestañas principales')
    expect(wrapper.text()).toContain('Información general del catálogo.')
  })

  it('navega a la vista de NavigationLayout al cambiar de ruta', async () => {
    const { wrapper } = await mountAt('/navigation-layout')

    expect(wrapper.findComponent(NavigationLayoutPage).exists()).toBe(true)
  })

  it('navega a la vista legacy al cambiar de ruta', async () => {
    const { wrapper } = await mountAt('/legacy')

    expect(wrapper.findComponent(LegacyPage).exists()).toBe(true)
  })

  it('navega a About y muestra los metadatos del package.json', async () => {
    const { wrapper } = await mountAt('/about')

    expect(wrapper.findComponent(AboutPage).exists()).toBe(true)
    expect(wrapper.text()).toContain('kitchensink')
    expect(wrapper.text()).toContain('A catalog of shared ZN Apps components and utilities.')
    expect(wrapper.text()).toContain('ZN Apps')
  })

  it('navega a la vista de esquema de color de pwa-integration', async () => {
    const { wrapper } = await mountAt('/pwa/color-scheme')

    expect(wrapper.findComponent(ColorSchemePage).exists()).toBe(true)
    expect(wrapper.text()).toContain('Tema del sistema')
    expect(wrapper.text()).toContain('Tema resuelto')
  })

  it('navega a la vista de barras del sistema de pwa-integration', async () => {
    const { wrapper } = await mountAt('/pwa/bar-styling')

    expect(wrapper.findComponent(PwaMetaPage).exists()).toBe(true)
    expect(wrapper.text()).toContain('theme-color')
    expect(wrapper.text()).toContain('Sincronizar con la pantalla')
  })

  it('navega a la vista de instalación PWA de pwa-integration', async () => {
    const { wrapper } = await mountAt('/pwa/install')

    expect(wrapper.findComponent(PwaInstallPage).exists()).toBe(true)
    expect(wrapper.text()).toContain('¿Instalada como PWA?')
    expect(wrapper.text()).toContain('Instalar ahora')
  })
})
