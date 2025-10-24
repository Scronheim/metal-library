import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/services/api'

import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token'))
  const user = ref<User>({
    id: '',
    username: '',
    email: '',
    profile: {
      bio: '',
      location: '',
      favoriteAlbums: [],
      favoriteGroups: [],
      website: ''
    },
    role: '',
    stats: {
      groupsAdded: 0,
      albumsAdded: 0,
      contributions: 0,
      reviewsWritten: 0
    },
    isVerified: false,
    lastLogin: new Date(),
    preferences: {
      emailNotifications: false,
      language: 'ru',
      theme: 'dark'
    }
  })
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
    user.value = null
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
    setAuthData
  }
})
