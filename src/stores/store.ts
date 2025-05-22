import { ref, watch } from 'vue'
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

  const user = ref<User>({
    level: 1,
    completedTasks: {},
  })

  async function apiQuery(query: string): Promise<void> {
    const { data } = await axios.post(
      'https://api.tarkov.dev/graphql',
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    const groupedQuests = groupBy(data.data.tasks, function (task: Task) {
      return task.trader.normalizedName
    })
    Object.keys(groupedQuests).map((trader: string) => {
      traders.value[trader].tasks = groupedQuests[trader]
    })
  }

  watch(user, (value) => {
    localStorage.setItem('user', JSON.stringify(value))
  }, {deep: true})

  return {
    user,
    traders,
    apiQuery,
  }
})
