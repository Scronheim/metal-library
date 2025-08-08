<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Plus, Delete, Check, CircleCheck, Close } from '@element-plus/icons-vue'

import { useStore } from '@/stores/store'

import type { Task, ActiveTask } from '@/types'

const store = useStore()

const filter = ref('')
const selectedTrader = ref('prapor')

const tasks = computed((): Task[] => {
  if (selectedTrader.value === 'active') {
    const result: Task[] = []
    store.user.activeTasks.forEach(t => {
      const task = store.tasks.find(task => task._id === t.task._id) as Task
      if (task) result.push(task)
    })
    return result
  } else if (selectedTrader.value === 'completed') {
    const result: Task[] = []
    store.user.completedTasks.forEach(t => {
      const task = store.tasks.find(task => task._id === t.task._id) as Task
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

const toggleTrackingTask = (task: Task): void => {
  const taskIndex = store.user.activeTasks.findIndex(t => t.task._id === task._id)
  if (taskIndex === -1) {
    store.user.activeTasks.push({
      task: { _id: task._id },
      objectives: task.objectives.flatMap((obj, index) => {
        return {
          index,
          completed: true,
          itemsNumber: obj.itemsNumber as number
        }
      })
    })
  } else {
    store.user.activeTasks.splice(taskIndex, 1)
  }
}

const toggleCompleteTask = (task: Task): void => {
  const taskIndex = store.user.completedTasks.findIndex(t => t.task._id === task._id)
  if (taskIndex === -1) {
    store.user.completedTasks.push({
      task: { _id: task._id },
      completedDate: new Date()
    })
    const activeTaskIndex = store.user.activeTasks.findIndex(t => t.task._id === task._id)
    if (activeTaskIndex > -1) store.user.activeTasks.splice(activeTaskIndex, 1)
  } else {
    store.user.completedTasks.splice(taskIndex, 1)
  }
}

const getUserTaskItemCount = (task: Task, objectiveIndex: number): number | undefined => {
  const t = store.user.activeTasks.find(t => t.task._id === task._id) as ActiveTask
  return t?.objectives[objectiveIndex].itemsNumber
}

const setUserObjectiveItemCount = (task: Task, objectiveIndex: number, value: number): void => {
  const activeTask = store.user.activeTasks.find(t => t.task._id === task._id) as ActiveTask
  activeTask.objectives[objectiveIndex].itemsNumber = value

  if (task.objectives[objectiveIndex].count === value) activeTask.objectives[objectiveIndex].completed = true
  else activeTask.objectives[objectiveIndex].completed = false
}

const toggleObjectiveAreCompleted = (task: Task, objectiveIndex: number): void => {
  const activeTask = store.user.activeTasks.find(t => t.task._id === task._id) as ActiveTask
  activeTask.objectives[objectiveIndex].completed = !activeTask.objectives[objectiveIndex].completed

  if (activeTask.objectives[objectiveIndex].completed && task.objectives[objectiveIndex].count) {
    activeTask.objectives[objectiveIndex].itemsNumber = task.objectives[objectiveIndex].count
  }
}

const checkObjectiveIsComplete = (task: Task, objectiveIndex: number): boolean => {
  if (!store.userIsAuth) return false
  const activeTask = store.user.activeTasks.find(t => t.task._id === task._id) as ActiveTask
  if (!activeTask) return false
  return activeTask.objectives[objectiveIndex].completed
}

onMounted(async () => {
  await store.getTasks()
})
</script>

<template>
  <div class="mb-5 flex items-center justify-center">
    <el-button-group size="large">
      <el-button v-if="store.userIsAuth" :type="selectedTrader === 'active' ? 'primary' : ''" @click="setSelectedTrader('active')">
        Активные квесты
      </el-button>
      <el-button :type="selectedTrader === 'prapor' ? 'primary' : ''" @click="setSelectedTrader('prapor')">Прапор</el-button>
      <el-button :type="selectedTrader === 'therapist' ? 'primary' : ''" @click="setSelectedTrader('therapist')">Терапевт</el-button>
      <el-button :type="selectedTrader === 'fence' ? 'primary' : ''" @click="setSelectedTrader('fence')">Скупщик</el-button>
      <el-button :type="selectedTrader === 'skier' ? 'primary' : ''" @click="setSelectedTrader('skier')">Лыжник</el-button>
      <el-button :type="selectedTrader === 'peacekeeper' ? 'primary' : ''" @click="setSelectedTrader('peacekeeper')">Миротворец</el-button>
      <el-button :type="selectedTrader === 'mechanic' ? 'primary' : ''" @click="setSelectedTrader('mechanic')">Механик</el-button>
      <el-button :type="selectedTrader === 'ragman' ? 'primary' : ''" @click="setSelectedTrader('ragman')">Барахольщик</el-button>
      <el-button :type="selectedTrader === 'jaeger' ? 'primary' : ''" @click="setSelectedTrader('jaeger')">Егерь</el-button>
      <el-button :type="selectedTrader === 'lightkeeper' ? 'primary' : ''" @click="setSelectedTrader('lightkeeper')">Смотритель</el-button>
      <el-button v-if="store.userIsAuth" :type="selectedTrader === 'completed' ? 'primary' : ''" @click="setSelectedTrader('completed')">
        Выполненные квесты
      </el-button>
    </el-button-group>
  </div>
  <el-input v-model="filter" placeholder="Поиск..." class="mb-3" />
  <div v-loading="store.queryIsLoading" class="grid grid-cols-4 gap-3">
    <el-card v-for="task in tasks" :key="task._id">
      <template #header>
        <div class="flex justify-between">
          <div>{{ task.name }}</div>
          <div v-if="store.userIsAuth">
            <el-tooltip :content="store.checkTrackingTaskExit(task._id) ? 'Удалить из активных' : 'Добавить в активные'" placement="top">
              <el-button
                :icon="store.checkTrackingTaskExit(task._id) ? Delete : Plus"
                :type="store.checkTrackingTaskExit(task._id) ? 'danger' : 'primary'"
                :disabled="store.checkCompletedTaskExit(task._id)"
                size="small"
                circle
                @click="toggleTrackingTask(task)"
              />
            </el-tooltip>
            <el-tooltip
              :content="store.checkCompletedTaskExit(task._id) ? 'Удалить из завершённых' : 'Отметить завершённым'"
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
        </div>
      </template>
      <div class="flex justify-center">
        <img :src="task.taskImageLink" />
      </div>
      <div class="flex flex-col">
        <span v-for="(obj, index) in task.objectives" :key="obj.description">
          <el-icon size="15px" color="#67c23a" class="m-2">
            <CircleCheck />
          </el-icon>
          <template v-if="['extract', 'findItem', 'giveItem', 'mark', 'shoot'].includes(obj.type)">
            <el-text
              :tag="checkObjectiveIsComplete(task, index) ? 'del' : 'span'"
              class="cursor-pointer"
              @click="toggleObjectiveAreCompleted(task, index)"
            >
              {{ obj.description }} ({{ obj.count }}шт.)
            </el-text>
            <el-input-number
              v-if="selectedTrader === 'active'"
              :model-value="getUserTaskItemCount(task, index)"
              :min="0"
              :max="obj.count"
              @change="setUserObjectiveItemCount(task, index, $event)"
            >
              <template #suffix>/{{ obj.count }}</template>
            </el-input-number>
          </template>
          <template v-else>
            <el-text
              :tag="checkObjectiveIsComplete(task, index) ? 'del' : 'span'"
              class="cursor-pointer"
              @click="toggleObjectiveAreCompleted(task, index)"
            >
              {{ obj.description }}
            </el-text>
          </template>
        </span>
      </div>
    </el-card>
  </div>
</template>
