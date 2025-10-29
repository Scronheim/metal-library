import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

import { getDefaultUser } from '@/consts'

import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User>(getDefaultUser())
  const isLoading = ref(false)

  const userIsAuth = computed(() => !!token.value)
  const userIsAdmin = computed(() => user.value.role === 'admin')

  const login = async credentials => {
    try {
      isLoading.value = true
      const response = await api.post('/auth/login', credentials)
      setAuthData(response.data)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    } finally {
      isLoading.value = false
    }
  }

  const register = async userData => {
    try {
      isLoading.value = true
      const response = await api.post('/auth/register', userData)
      setAuthData(response.data)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = getDefaultUser()
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  const setAuthData = data => {
    token.value = data.token
    user.value = data.user

    localStorage.setItem('token', data.token)

    api.defaults.headers.common['Authorization'] = data.token
  }

  const checkAuth = async () => {
    if (!token.value) return false

    try {
      api.defaults.headers.common['Authorization'] = token.value
      const response = await api.get('/auth/me')
      user.value = response.data
      return true
    } catch {
      logout()
      return false
    }
  }

  // OAuth методы
  const initiateOAuth = provider => {
    window.location.href = `https://metal-library.ru/api/auth/${provider}`
  }

  const handleOAuthCallback = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const error = urlParams.get('error')

    if (error) {
      return { success: false, error }
    }

    if (token) {
      // Получаем данные пользователя с токеном
      api.defaults.headers.common['Authorization'] = token

      // Здесь можно получить данные пользователя или перенаправить
      return { success: true, token }
    }

    return { success: false, error: 'No token received' }
  }

  const handleOAuthSuccess = async (token, userId) => {
    try {
      isLoading.value = true

      // Устанавливаем токен
      setAuthData({
        token,
        user: { _id: userId }
      })

      // Получаем полные данные пользователя
      const userData = await checkAuth()

      if (userData) {
        return { success: true }
      } else {
        throw new Error('Failed to load user data')
      }
    } catch (error) {
      console.error('OAuth success handling error:', error)
      logout()
      return { success: false, error: error.message }
    } finally {
      isLoading.value = false
    }
  }

  const handleVKAuth = async vkData => {
    try {
      isLoading.value = true

      // Отправляем данные VK на бэкенд для верификации и создания пользователя
      const response = await api.post('/auth/vk/callback', vkData)

      // Устанавливаем данные аутентификации
      setAuthData(response.data)

      return { success: true }
    } catch (error) {
      console.error('VK auth error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Ошибка авторизации через VK'
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    token,
    user,
    isLoading,
    userIsAuth,
    userIsAdmin,
    login,
    register,
    logout,
    checkAuth,
    initiateOAuth,
    handleOAuthCallback,
    handleOAuthSuccess,
    setAuthData,
    handleVKAuth
  }
})
