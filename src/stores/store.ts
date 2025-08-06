import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { groupBy } from 'lodash-es'

import type { Trader, Task, User } from '@/types'

export const useStore = defineStore('store', () => {
  const traders = ref({
    prapor: <Trader>{
      name: 'Прапор',
      normalizedName: 'prapor',
      tasks: [],
      trade: [],
    },
    therapist: {
      tasks: [],
    },
    jaeger: {
      tasks: [],
    },
    skier: {
      tasks: [],
    },
    peacekeeper: {
      tasks: [],
    },
    mechanic: {
      tasks: [],
    },
    ragman: {
      tasks: [],
    },
    fence: {
      tasks: [],
    },
    ref: {
      tasks: [],
    },
    lightkeeper: {
      tasks: [],
    },
    'btr-driver': {
      tasks: [],
    },
  })
  const tasks = ref<Task[]>([])

  const user = ref<User>({
    nickname: '',
    level: 1,
    fraction: 'BEAR',
    gameEdition: 'The Unheard',
    completedTasks: [],
    trackingTasks: {},
  })

  const queryIsLoading = ref(false)

  async function apiQuery(): Promise<void> {
    try {
      queryIsLoading.value = true
      const { data } = await axios.get('/api/tasks')
      console.log(data.data)

      tasks.value = data.data
    } catch (e) {
      console.log(e)
    } finally {
      queryIsLoading.value = false
    }
  }

  const checkTrackingTaskExit = (taskId: string): boolean => {
    return !!user.value.trackingTasks[taskId]
  }

  watch(
    user,
    (value) => {
      localStorage.setItem('user', JSON.stringify(value))
    },
    { deep: true }
  )

  return {
    user,
    traders,
    tasks,
    queryIsLoading,
    apiQuery,
    checkTrackingTaskExit,
  }
})
