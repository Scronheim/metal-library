<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, Delete, Check, CircleCheck, Close } from '@element-plus/icons-vue'

import { useStore } from '@/stores/store'

import type { Objective, Task } from '@/types'

const store = useStore()

const filter = ref('')
const selectedTrader = ref('prapor')

const tasks = computed((): Task[] => {
  if (selectedTrader.value === 'active') {
    const result: Task[] = []
    Object.entries(store.user.trackingTasks).forEach((value) => {
      const task = store.tasks.find((task) => task._id === value[0]) as Task
      if (task) result.push(task)
    })
    return result
  } else if (selectedTrader.value === 'completed') {
    const result: Task[] = []
    store.user.completedTasks.forEach((t) => {
      const task = store.tasks.find((task) => task._id === t.task._id) as Task
      if (task) result.push(task)
    })
    return result
  }
  return store.tasks
    .filter((task: Task) => task.trader.normalizedName === selectedTrader.value)
    .filter((task: Task) => task.minPlayerLevel <= store.user.level)
    .filter((task: Task) => filter.value === '' || task.name.toUpperCase().indexOf(filter.value.toUpperCase()) >= 0)
})

const setSelectedTrader = (trader: string) => {
  selectedTrader.value = trader
}

const getCheckboxLabel = (obj: Objective): string => {
  switch (obj.type) {
    case 'extract':
    case 'findItem':
    case 'mark':
    case 'shoot':
      return `${obj.description} (${obj.count} шт.)`
    default:
      return obj.description
  }
}

const toggleTaskToTrack = (task: Task): void => {
  const taskExist = store.user.trackingTasks[task._id]

  if (taskExist) delete store.user.trackingTasks[task._id]
  else store.user.trackingTasks[task._id] = { name: task.name }
}

const toggleCompleteTask = (task: Task): void => {
  const taskIndex = store.user.completedTasks.findIndex((t) => t.task._id === task._id)
  if (taskIndex === -1) {
    store.user.completedTasks.push({
      task: { _id: task._id },
      objectives: task.objectives.map((obj, index) => {
        return {
          index,
          completed: true,
          itemsNumber: obj.count,
        }
      }),
      complete: true,
    })
  } else {
    store.user.completedTasks.splice(taskIndex, 1)
  }
}

onMounted(async () => {
  await store.apiQuery()
})
</script>

<template>
  <div class="mb-5 flex items-center justify-center">
    <el-button-group size="large">
      <el-button
        :type="selectedTrader === 'active' ? 'primary' : ''"
        @click="setSelectedTrader('active')"
      >
        Активные квесты
      </el-button>
      <el-button
        :type="selectedTrader === 'prapor' ? 'primary' : ''"
        @click="setSelectedTrader('prapor')"
      >
        Прапор
      </el-button>
      <el-button
        :type="selectedTrader === 'therapist' ? 'primary' : ''"
        @click="setSelectedTrader('therapist')"
      >
        Терапевт
      </el-button>
      <el-button
        :type="selectedTrader === 'fence' ? 'primary' : ''"
        @click="setSelectedTrader('fence')"
      >
        Скупщик
      </el-button>
      <el-button
        :type="selectedTrader === 'skier' ? 'primary' : ''"
        @click="setSelectedTrader('skier')"
      >
        Лыжник
      </el-button>
      <el-button
        :type="selectedTrader === 'peacekeeper' ? 'primary' : ''"
        @click="setSelectedTrader('peacekeeper')"
      >
        Миротворец
      </el-button>
      <el-button
        :type="selectedTrader === 'mechanic' ? 'primary' : ''"
        @click="setSelectedTrader('mechanic')"
      >
        Механик
      </el-button>
      <el-button
        :type="selectedTrader === 'ragman' ? 'primary' : ''"
        @click="setSelectedTrader('ragman')"
      >
        Барахольщик
      </el-button>
      <el-button
        :type="selectedTrader === 'jaeger' ? 'primary' : ''"
        @click="setSelectedTrader('jaeger')"
      >
        Егерь
      </el-button>
      <el-button
        :type="selectedTrader === 'lightkeeper' ? 'primary' : ''"
        @click="setSelectedTrader('lightkeeper')"
      >
        Смотритель
      </el-button>
      <el-button
        :type="selectedTrader === 'completed' ? 'primary' : ''"
        @click="setSelectedTrader('completed')"
      >
        Выполненные квесты
      </el-button>
    </el-button-group>
  </div>
  <el-input
    v-model="filter"
    placeholder="Поиск..."
    class="mb-3"
  />
  <div
    v-loading="store.queryIsLoading"
    class="grid grid-cols-4 gap-3"
  >
    <el-card
      v-for="task in tasks"
      :key="task._id"
    >
      <template #header>
        <div class="flex justify-between">
          <div>{{ task.name }}</div>
          <el-tag type="success"> {{ task.experience }} EXP </el-tag>
          <el-tooltip
            :content="store.checkTrackingTaskExit(task._id) ? 'Удалить из активных' : 'Добавить в активные'"
            placement="top"
          >
            <el-button
              :icon="store.checkTrackingTaskExit(task._id) ? Delete : Plus"
              :type="store.checkTrackingTaskExit(task._id) ? 'danger' : 'primary'"
              size="small"
              circle
              @click="toggleTaskToTrack(task)"
            />
          </el-tooltip>
          <el-tooltip
            content="Отметить завершённым"
            placement="top"
          >
            <el-button
              :icon="store.checkCompletedTaskExit(task._id) ? Close : Check"
              :type="store.checkCompletedTaskExit(task._id) ? 'danger' : 'success'"
              size="small"
              circle
              @click="toggleCompleteTask(task)"
            />
          </el-tooltip>
        </div>
      </template>
      <div class="flex justify-center">
        <img :src="task.taskImageLink" />
      </div>
      <div class="flex flex-col">
        <span
          v-for="(obj, index) in task.objectives"
          :key="obj.description"
        >
          <el-icon
            size="15px"
            color="#67c23a"
            class="m-2"
            ><CircleCheck
          /></el-icon>
          <el-text>{{ getCheckboxLabel(obj) }}</el-text>
        </span>
      </div>
    </el-card>
  </div>
</template>
