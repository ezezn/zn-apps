// kitchensink/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
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
import SettingsPage from '../views/SettingsPage.vue'
import ColorSchemePage from '../views/ColorSchemePage.vue'
import PwaMetaPage from '../views/PwaMetaPage.vue'
import PwaInstallPage from '../views/PwaInstallPage.vue'

export const routes = [
  { path: '/', redirect: '/buttons' },
  { path: '/buttons', name: 'buttons', component: ButtonsPage },
  { path: '/cards', name: 'cards', component: CardsPage },
  { path: '/switches', name: 'switches', component: SwitchesPage },
  { path: '/dialogs', name: 'dialogs', component: DialogsPage },
  { path: '/icons', name: 'icons', component: IconsPage },
  { path: '/layout', name: 'layout', component: LayoutPage },
  { path: '/sections', name: 'sections', component: SectionsPage },
  { path: '/screen', name: 'screen', component: ScreenPage },
  { path: '/tabs', name: 'tabs', component: TabsPage },
  { path: '/navigation-layout', name: 'navigation-layout', component: NavigationLayoutPage },
  { path: '/legacy', name: 'legacy', component: LegacyPage },
  { path: '/about', name: 'about', component: AboutPage },
  { path: '/settings', name: 'settings', component: SettingsPage },
  {
    path: '/pwa/color-scheme',
    name: 'pwa-color-scheme',
    component: ColorSchemePage
  },
  {
    path: '/pwa/bar-styling',
    name: 'pwa-bar-styling',
    component: PwaMetaPage
  },
  {
    path: '/pwa/install',
    name: 'pwa-install',
    component: PwaInstallPage
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
