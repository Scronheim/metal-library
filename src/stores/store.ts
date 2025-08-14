import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'
import axios from 'axios'
import { ElNotification } from 'element-plus'
import { debounce } from 'lodash-es'

import type { Trader, Task, User, AuthData, Item } from '@/types'

export const useStore = defineStore('store', () => {
  const router = useRouter()
  const traders = ref({
    prapor: <Trader>{
      name: 'Прапор',
      normalizedName: 'prapor',
      tasks: [],
      trade: []
    },
    therapist: {
      tasks: []
    },
    jaeger: {
      tasks: []
    },
    skier: {
      tasks: []
    },
    peacekeeper: {
      tasks: []
    },
    mechanic: {
      tasks: []
    },
    ragman: {
      tasks: []
    },
    fence: {
      tasks: []
    },
    ref: {
      tasks: []
    },
    lightkeeper: {
      tasks: []
    },
    'btr-driver': {
      tasks: []
    }
  })
  const tasks = ref<Task[]>([])
  const items = ref<Item[]>([])
  const itemFilter = ref<string>('')

  const user = ref<User>({
    username: '',
    nickname: '',
    level: 1,
    fraction: 'BEAR',
    gameEdition: 'The Unheard',
    completedTasks: [],
    activeTasks: [],
    necessaryItems: []
  })
  const token = ref<string | null>(localStorage.getItem('token'))

  const queryIsLoading = ref(false)

  const userIsAuth = computed(() => {
    return !!token.value
  })

  function toggleNecessaryItem(item: Item): void {
    const itemIndex = user.value.necessaryItems.findIndex(i => i.item._id === item._id)
    if (itemIndex === -1) user.value.necessaryItems.push({ item, count: 1, itemCount: 0 })
    else user.value.necessaryItems.splice(itemIndex, 1)
  }

  async function searchItem(): Promise<void> {
    try {
      queryIsLoading.value = true
      const { data } = await axios.get(`/eft/api/items?q=${itemFilter.value}`)
      items.value = data.data
    } finally {
      queryIsLoading.value = false
    }
  }

  async function getItems(): Promise<void> {
    try {
      queryIsLoading.value = true
      const { data } = await axios.get('/eft/api/items')
      items.value = data.data
    } finally {
      queryIsLoading.value = false
    }
  }

  async function getTasks(): Promise<void> {
    try {
      queryIsLoading.value = true
      const { data } = await axios.get('/eft/api/tasks')
      tasks.value = data.data
    } finally {
      queryIsLoading.value = false
    }
  }

  async function aboutMe(): Promise<void> {
    const { data } = await axios.get('/eft/api/me', { headers: { 'x-access-token': token.value } })
    user.value = { ...data.data }
  }

  async function register(registerData: AuthData): Promise<void> {
    const { data } = await axios.post('/eft/api/register', { ...user.value, ...registerData })
    if (data.data.auth) {
      user.value = data.data.user
      axios.defaults.headers.common['Authorization'] = data.data.token
      localStorage.setItem('token', data.data.token)
      token.value = data.data.token
      router.push('/')
      ElNotification({
        title: 'Успешно',
        message: 'Вы успешно зарегистрированы',
        type: 'success'
      })
    } else {
      ElNotification({
        title: 'Ошибка',
        message: data.data.message,
        type: 'error'
      })
    }
  }

  async function login(authData: AuthData): Promise<void> {
    try {
      const { data } = await axios.post('/eft/api/login', authData)
      if (data.data.auth) {
        user.value = { ...user.value, ...data.data.user }
        axios.defaults.headers.common['Authorization'] = data.data.token
        localStorage.setItem('token', data.data.token)
        token.value = data.data.token
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

  const checkTrackingTaskExit = (taskId: string): boolean => {
    return !!user.value.activeTasks.find(t => t.task._id === taskId)
  }

  const checkCompletedTaskExit = (taskId: string): boolean => {
    return !!user.value.completedTasks.find(t => t.task._id === taskId)
  }

  const checkItemIsNecessary = (item: Item): boolean => {
    return !!user.value.necessaryItems.find(t => t.item._id === item._id)
  }

  watch(
    user,
    debounce(async () => {
      if (user.value._id) await updateCurrentUser()
    }, 500),
    { deep: true }
  )

  watch(
    itemFilter,
    debounce(async () => {
      await searchItem()
    }, 500)
  )

  return {
    user,
    traders,
    tasks,
    items,
    queryIsLoading,
    userIsAuth,
    token,
    itemFilter,
    getTasks,
    getItems,
    searchItem,
    checkTrackingTaskExit,
    checkCompletedTaskExit,
    checkItemIsNecessary,
    checkUserLoggedIn,
    register,
    login,
    logout,
    aboutMe,
    toggleNecessaryItem
  }
})
