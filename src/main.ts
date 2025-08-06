import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'

import '@/styles/style.css'
import '@/styles/index.scss'
// import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'

import App from './App.vue'

createApp(App).use(router).use(createPinia()).mount('#app')
