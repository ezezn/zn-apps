import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TasksPage from '../views/TasksPage.vue'
import UpdatesPage from '../views/UpdatesPage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import AboutPage from '../views/AboutPage.vue'

export const routes = [
  // La Home es la página principal: el calendario y el reporte del día.
  { path: '/', name: 'home', component: HomePage },
  { path: '/tasks', name: 'tasks', component: TasksPage },
  { path: '/updates', name: 'updates', component: UpdatesPage },
  { path: '/settings', name: 'settings', component: SettingsPage },
  { path: '/about', name: 'about', component: AboutPage },
  // Cualquier entrada directa (por ejemplo `.../index.html`, que es el
  // `start_url` del manifest PWA) arranca en la Home.
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
