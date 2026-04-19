import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import { plugin, defaultConfig } from '@formkit/vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import config from '../formkit.config.ts'

import App from './App.vue'
import router from './router'
import './assets/app.css'
import { setupChartDefaults } from './utils/chartHelpers'
setupChartDefaults()

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(MotionPlugin)
app.use(plugin, defaultConfig(config))
app.use(VueQueryPlugin)
app.mount('#app')
