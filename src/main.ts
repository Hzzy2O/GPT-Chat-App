import '@unocss/reset/normalize.css'
import '@unocss/reset/eric-meyer.css'
import '@unocss/reset/tailwind.css'
import './styles/main.scss'
import './styles/hljs_dark.scss'
import 'uno.css'
import 'iconify-icon'
import 'virtual:svg-icons-register'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'
import App from './App.vue'
import store from '@/store'
import i18n from '@/locales'
import { recorderPolyfill } from '@/utils/polyfill'

recorderPolyfill()

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.component('DynamicScroller', DynamicScroller)
app.component('DynamicScrollerItem', DynamicScrollerItem)
app.use(router)
app.use(store)
app.use(i18n)
app.mount('#app')
