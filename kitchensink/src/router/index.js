// kitchensink/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ButtonsPage from '../views/ButtonsPage.vue'
import CardsPage from '../views/CardsPage.vue'
import SwitchesPage from '../views/SwitchesPage.vue'

const routes = [
  { path: '/', redirect: '/buttons' },
  { path: '/buttons', name: 'buttons', component: ButtonsPage },
  { path: '/cards', name: 'cards', component: CardsPage },
  { path: '/switches', name: 'switches', component: SwitchesPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})