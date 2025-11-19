import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import router from './router'

import '@/styles/index.scss'
import '@/styles/tailwind.css'

import App from './App.vue'

const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers['Authorization'] = token
}

createApp(App).use(router).use(createPinia()).mount('#app')
