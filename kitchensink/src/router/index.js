// kitchensink/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import ButtonsPage from '../views/ButtonsPage.vue'
import CardsPage from '../views/CardsPage.vue'
import SwitchesPage from '../views/SwitchesPage.vue'
import InputsPage from '../views/InputsPage.vue'
import TextPage from '../views/inputs/TextPage.vue'
import MultilinePage from '../views/inputs/MultilinePage.vue'
import EmailPage from '../views/inputs/EmailPage.vue'
import PhonePage from '../views/inputs/PhonePage.vue'
import DatePage from '../views/inputs/DatePage.vue'
import TimePage from '../views/inputs/TimePage.vue'
import DateTimePage from '../views/inputs/DateTimePage.vue'
import SelectPage from '../views/inputs/SelectPage.vue'
import RangePage from '../views/inputs/RangePage.vue'
import DateRangePage from '../views/inputs/DateRangePage.vue'
import TimeRangePage from '../views/inputs/TimeRangePage.vue'
import DateTimeRangePage from '../views/inputs/DateTimeRangePage.vue'
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
import DataCorePage from '../views/data/DataCorePage.vue'
import DataFormPage from '../views/data/DataFormPage.vue'
import DataViewPage from '../views/data/DataViewPage.vue'
import DataEditorPage from '../views/data/DataEditorPage.vue'

export const routes = [
  { path: '/', redirect: '/buttons' },
  { path: '/buttons', name: 'buttons', component: ButtonsPage },
  { path: '/cards', name: 'cards', component: CardsPage },
  { path: '/switches', name: 'switches', component: SwitchesPage },
  { path: '/inputs', name: 'inputs', component: InputsPage },
  { path: '/inputs/text', name: 'input-text', component: TextPage },
  { path: '/inputs/multiline', name: 'input-multiline', component: MultilinePage },
  { path: '/inputs/email', name: 'input-email', component: EmailPage },
  { path: '/inputs/phone', name: 'input-phone', component: PhonePage },
  { path: '/inputs/date', name: 'input-date', component: DatePage },
  { path: '/inputs/time', name: 'input-time', component: TimePage },
  { path: '/inputs/datetime', name: 'input-datetime', component: DateTimePage },
  { path: '/inputs/select', name: 'input-select', component: SelectPage },
  { path: '/inputs/range', name: 'input-range', component: RangePage },
  { path: '/inputs/date-range', name: 'input-date-range', component: DateRangePage },
  { path: '/inputs/time-range', name: 'input-time-range', component: TimeRangePage },
  { path: '/inputs/datetime-range', name: 'input-datetime-range', component: DateTimeRangePage },
  { path: '/data/core', name: 'data-core', component: DataCorePage },
  { path: '/data/form', name: 'data-form', component: DataFormPage },
  { path: '/data/view', name: 'data-view', component: DataViewPage },
  { path: '/data/editor', name: 'data-editor', component: DataEditorPage },
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
