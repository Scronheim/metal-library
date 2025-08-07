import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import router from './router'

import '@/styles/style.css'
import '@/styles/index.scss'
// import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/dark/css-vars.css'

import App from './App.vue'

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers['Authorization'] = token
}

createApp(App).use(router).use(createPinia()).mount('#app')
