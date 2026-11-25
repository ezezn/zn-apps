// kitchensink/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

export const routes = [
  { path: '/', redirect: '/buttons' },
  { path: '/buttons', name: 'buttons', component: () => import('../views/ButtonsPage.vue') },
  { path: '/cards', name: 'cards', component: () => import('../views/CardsPage.vue') },
  { path: '/switches', name: 'switches', component: () => import('../views/SwitchesPage.vue') },
  { path: '/inputs', name: 'inputs', component: () => import('../views/InputsPage.vue') },
  { path: '/inputs/text', name: 'input-text', component: () => import('../views/inputs/TextPage.vue') },
  { path: '/inputs/multiline', name: 'input-multiline', component: () => import('../views/inputs/MultilinePage.vue') },
  { path: '/inputs/email', name: 'input-email', component: () => import('../views/inputs/EmailPage.vue') },
  { path: '/inputs/phone', name: 'input-phone', component: () => import('../views/inputs/PhonePage.vue') },
  { path: '/inputs/number', name: 'input-number', component: () => import('../views/inputs/NumberPage.vue') },
  { path: '/inputs/date', name: 'input-date', component: () => import('../views/inputs/DatePage.vue') },
  { path: '/inputs/time', name: 'input-time', component: () => import('../views/inputs/TimePage.vue') },
  { path: '/inputs/datetime', name: 'input-datetime', component: () => import('../views/inputs/DateTimePage.vue') },
  { path: '/inputs/select', name: 'input-select', component: () => import('../views/inputs/SelectPage.vue') },
  { path: '/inputs/chip', name: 'input-chip', component: () => import('../views/inputs/ChipPage.vue') },
  { path: '/inputs/range', name: 'input-range', component: () => import('../views/inputs/RangePage.vue') },
  { path: '/inputs/date-range', name: 'input-date-range', component: () => import('../views/inputs/DateRangePage.vue') },
  { path: '/inputs/time-range', name: 'input-time-range', component: () => import('../views/inputs/TimeRangePage.vue') },
  { path: '/inputs/datetime-range', name: 'input-datetime-range', component: () => import('../views/inputs/DateTimeRangePage.vue') },
  { path: '/data/core', name: 'data-core', component: () => import('../views/data/DataCorePage.vue') },
  { path: '/data/form', name: 'data-form', component: () => import('../views/data/DataFormPage.vue') },
  { path: '/data/view', name: 'data-view', component: () => import('../views/data/DataViewPage.vue') },
  { path: '/data/editor', name: 'data-editor', component: () => import('../views/data/DataEditorPage.vue') },
  { path: '/data/grid', name: 'data-grid', component: () => import('../views/data/DataGridPage.vue') },
  { path: '/data/richtext', name: 'data-richtext', component: () => import('../views/data/DataRichTextPage.vue') },
  { path: '/data/dashlets', name: 'data-dashlets', component: () => import('../views/data/DashletsPage.vue') },
  { path: '/data/dashlets-data', name: 'data-dashlets-data', component: () => import('../views/data/DashletsDataPage.vue') },
  { path: '/data/charts', name: 'data-charts', component: () => import('../views/data/ChartsPage.vue') },
  { path: '/data/charts-data', name: 'data-charts-data', component: () => import('../views/data/ChartsDataPage.vue') },
  { path: '/calendar/month', name: 'calendar-month', component: () => import('../views/calendar/MonthPage.vue') },
  { path: '/calendar/range', name: 'calendar-range', component: () => import('../views/calendar/RangePage.vue') },
  { path: '/calendar/week', name: 'calendar-week', component: () => import('../views/calendar/WeekPage.vue') },
  { path: '/calendar/day', name: 'calendar-day', component: () => import('../views/calendar/DayPage.vue') },
  { path: '/dialogs', name: 'dialogs', component: () => import('../views/DialogsPage.vue') },
  { path: '/icons', name: 'icons', component: () => import('../views/IconsPage.vue') },
  { path: '/layout', name: 'layout', component: () => import('../views/LayoutPage.vue') },
  { path: '/sections', name: 'sections', component: () => import('../views/SectionsPage.vue') },
  { path: '/screen', name: 'screen', component: () => import('../views/ScreenPage.vue') },
  { path: '/tabs', name: 'tabs', component: () => import('../views/TabsPage.vue') },
  { path: '/navigation-layout', name: 'navigation-layout', component: () => import('../views/NavigationLayoutPage.vue') },
  { path: '/legacy', name: 'legacy', component: () => import('../views/LegacyPage.vue') },
  { path: '/about', name: 'about', component: () => import('../views/AboutPage.vue') },
  { path: '/settings', name: 'settings', component: () => import('../views/SettingsPage.vue') },
  {
    path: '/pwa/color-scheme',
    name: 'pwa-color-scheme',
    component: () => import('../views/ColorSchemePage.vue')
  },
  {
    path: '/pwa/bar-styling',
    name: 'pwa-bar-styling',
    component: () => import('../views/PwaMetaPage.vue')
  },
  {
    path: '/pwa/install',
    name: 'pwa-install',
    component: () => import('../views/PwaInstallPage.vue')
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
