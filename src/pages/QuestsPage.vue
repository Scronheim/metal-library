<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

import { useStore } from '@/stores/store'

import { TASKS } from '@/graphqlRequests'

import type { Objective, Task } from '@/types'

const store = useStore()
const route = useRoute()

const filter = ref('')

const traderTasks = computed((): Task[] => {
  return store.traders[route.params.trader as string].tasks.filter((task: Task) => {
    return filter.value === '' || task.name.toUpperCase().indexOf(filter.value.toUpperCase()) >= 0
  })
})

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

onMounted(async () => {
  await store.apiQuery(TASKS)
})
</script>

<template>
  <el-input
    class="mb-3"
    placeholder="Поиск..."
    v-model="filter"
  />
  <div class="grid grid-cols-4 gap-3">
    <el-card
      v-for="task in traderTasks"
      :key="task.id"
    >
      <template #header>
        <div class="flex justify-between">
          <div>{{ task.name }}</div>
          <el-tag type="success">{{ task.experience }} EXP</el-tag>
        </div>
      </template>
      <div class="flex justify-center">
        <img :src="task.taskImageLink" />
      </div>
      <div class="flex flex-col">
        <el-checkbox-group v-model="store.user.completedTasks[task.id]">
          <el-checkbox
            v-for="(obj, index) in task.objectives"
            :key="obj.description"
            :label="getCheckboxLabel(obj)"
            :value="index"
          />
        </el-checkbox-group>
      </div>
    </el-card>
  </div>
</template>
