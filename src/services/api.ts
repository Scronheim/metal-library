import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://metal-archives.ru/api'
})

// Интерцептор для добавления токена
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Интерцептор для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/#/auth'
    }
    return Promise.reject(error)
  }
)
