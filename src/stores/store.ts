import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { debounce } from 'lodash-es'

import type { User, AuthData, Group, Album, Genre, TrackInfo } from '@/types'

export const useStore = defineStore('store', () => {
  const router = useRouter()

  const user = ref<User>({
    id: '',
    username: '',
    email: '',
    profile: {
      bio: '',
      location: '',
      favoriteBands: [],
      favoriteGenres: [],
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
  const token = ref<string | null>(localStorage.getItem('token'))
  const queryIsLoading = ref(false)
  const albumTypesMap = ref({
    'full-length': 'Студийный альбом',
    ep: 'EP',
    single: 'Сингл',
    demo: 'Демо',
    live: 'Концертный альбом',
    compilation: 'Сборник',
    split: 'Сплит'
  })

  const userIsAuth = computed(() => !!token.value)
  const userIsAdmin = computed(() => user.value.role === 'admin')

  async function updateLyrics(album: Album, track: TrackInfo, showNotification: boolean = false): Promise<void> {
    await axios.patch(`/eft/api/albums/${album._id}/tracks/${track.number}/lyrics`, { track })
    if (showNotification)
      ElNotification({
        type: 'success',
        message: 'Текст трека успешно обновлен'
      })
  }
  async function updateAlbum(album: Album, showNotification: boolean = false): Promise<void> {
    await axios.put(`/eft/api/albums/${album._id}`, album)
    if (showNotification)
      ElNotification({
        type: 'success',
        message: 'Альбом успешно обновлен'
      })
  }

  async function updateGroup(group: Group, showNotification: boolean = false): Promise<void> {
    await axios.put(`/eft/api/groups/${group._id}`, group)
    if (showNotification)
      ElNotification({
        type: 'success',
        message: 'Группа успешно обновлена'
      })
  }

  async function searchGroup(searchQuery: string): Promise<{ data: { groups: Group[] } }> {
    return await axios.get(`/eft/api/groups?search=${searchQuery}&limit=5`)
  }

  async function getGenres(): Promise<{ data: Genre[] }> {
    return await axios.get('/eft/api/genres')
  }

  async function toggleLike(album: Album): Promise<{ newAlbum: Album; message: string }> {
    const { data } = await axios.patch(`/eft/api/albums/${album._id}/like`)

    return {
      newAlbum: data.album,
      message: data.message
    }
  }

  async function aboutMe(): Promise<void> {
    const { data } = await axios.get('/eft/api/auth/me')
    user.value = { ...data }
  }

  async function register(registerData: AuthData): Promise<void> {
    const { data } = await axios.post('/eft/api/auth/register', { ...user.value, ...registerData })

    if (data) {
      user.value = data.user
      axios.defaults.headers.common['Authorization'] = data.token
      localStorage.setItem('token', data.token)
      token.value = data.token
      router.push('/')
      ElNotification({
        title: 'Успешно',
        message: 'Вы успешно зарегистрированы',
        type: 'success'
      })
    } else {
      ElNotification({
        title: 'Ошибка',
        message: data.message,
        type: 'error'
      })
    }
  }

  async function login(authData: AuthData): Promise<void> {
    try {
      const { data } = await axios.post('/eft/api/auth/login', authData)
      if (data) {
        user.value = { ...user.value, ...data.user }
        axios.defaults.headers.common['Authorization'] = data.token
        localStorage.setItem('token', data.token)
        token.value = data.token
        router.push('/')
      } else {
        ElNotification({
          title: 'Ошибка',
          message: 'Вы ввели не правильный email или пароль',
          type: 'error'
        })
      }
    } catch {
      localStorage.removeItem('token')
    }
  }

  async function updateCurrentUser(showNotification: boolean = false): Promise<void> {
    await axios.patch('/eft/api/update_user', user.value)
    if (showNotification) {
      ElNotification({
        title: 'Успешно',
        message: 'Пользователь сохранён',
        type: 'success'
      })
    }
  }

  function logout() {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    token.value = null
  }

  async function checkUserLoggedIn(): Promise<void> {
    if (token.value && !user.value._id) await aboutMe()
  }

  watch(
    user,
    debounce(async () => {
      if (user.value._id) await updateCurrentUser()
    }, 500),
    { deep: true }
  )

  return {
    user,
    queryIsLoading,
    userIsAuth,
    userIsAdmin,
    token,
    albumTypesMap,
    checkUserLoggedIn,
    register,
    login,
    logout,
    aboutMe,
    searchGroup,
    updateAlbum,
    updateGroup,
    getGenres,
    toggleLike,
    updateLyrics
  }
})
