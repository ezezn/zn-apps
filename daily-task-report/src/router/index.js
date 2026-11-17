import { createRouter, createWebHistory } from 'vue-router'
import TasksPage from '../views/TasksPage.vue'
import UpdatesPage from '../views/UpdatesPage.vue'
import SettingsPage from '../views/SettingsPage.vue'
import AboutPage from '../views/AboutPage.vue'

export const routes = [
  { path: '/', redirect: '/tasks' },
  { path: '/tasks', name: 'tasks', component: TasksPage },
  { path: '/updates', name: 'updates', component: UpdatesPage },
  { path: '/settings', name: 'settings', component: SettingsPage },
  { path: '/about', name: 'about', component: AboutPage },
  // Cualquier entrada directa (por ejemplo `.../index.html`, que es el
  // `start_url` del manifest PWA) arranca en la página de tareas.
  { path: '/:pathMatch(.*)*', redirect: '/tasks' }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
