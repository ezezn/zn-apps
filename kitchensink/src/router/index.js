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

const routes = [
  { path: '/', redirect: '/buttons' },
  { path: '/buttons', name: 'buttons', component: ButtonsPage },
  { path: '/cards', name: 'cards', component: CardsPage },
  { path: '/switches', name: 'switches', component: SwitchesPage },
  { path: '/icons', name: 'icons', component: IconsPage },
  { path: '/layout', name: 'layout', component: LayoutPage },
  { path: '/sections', name: 'sections', component: SectionsPage },
  { path: '/screen', name: 'screen', component: ScreenPage },
  { path: '/navigation-layout', name: 'navigation-layout', component: NavigationLayoutPage },
  { path: '/legacy', name: 'legacy', component: LegacyPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
