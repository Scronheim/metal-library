<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'

import { useStore } from '@/stores/store'

import type { Task } from './types'

const store = useStore()

const levelImageSrc = computed((): string => {
  const levelGroup = Math.ceil(store.user.level / 5)
  return `/eft/images/levelgroups/${levelGroup}.png`
})

const removeTrackingTask = (taskId: string) => {
  delete store.user.trackingTasks[taskId]
}

onMounted(() => {
  store.user = { ...store.user, ...JSON.parse(localStorage.getItem('user') as string) }
})
</script>

<template>
  <div class="flex items-center dark:bg-slate-600 font-bold p-2">
    <el-button
      tag="router-link"
      to="/"
      type="primary"
      text
      bg
    >
      Главная
    </el-button>
    <el-button
      tag="router-link"
      to="/quests"
      type="primary"
      text
      bg
    >
      Квесты
    </el-button>
  </div>
  <el-container>
    <el-aside
      width="240px"
      class="mt-6"
    >
      <el-card>
        <template #header>
          <div class="flex flex-col items-center">
            <el-input
              v-model="store.user.nickname"
              placeholder="Ник персонажа"
            />
            <img :src="levelImageSrc">
          </div>
        </template>
        <div class="flex flex-col">
          <p>Фракция</p>
          <el-select
            v-model="store.user.fraction"
            placeholder="Фракция"
            style="width: 200px"
          >
            <template #prefix>
              <img
                :src="`/eft/images/${store.user.fraction}.webp`"
                width="20"
              >
            </template>
            <el-option
              label="BEAR"
              value="BEAR"
            />
            <el-option
              label="USEC"
              value="USEC"
            />
          </el-select>
        </div>
        <div class="flex flex-col">
          <p>Уровень</p>
          <el-input-number
            v-model.number="store.user.level"
            :min="1"
            :max="100"
            style="width: 200px;"
          />
        </div>
        <div class="flex flex-col">
          <p>Издание</p>
          <el-select
            v-model="store.user.gameEdition"
            placeholder="Издание"
            style="width: 200px"
          >
            <el-option
              label="Standart"
              value="Standart"
            />
            <el-option
              label="Left Behind"
              value="Left behind"
            />
            <el-option
              label="Prepare for Escape"
              value="Prepare for Escape"
            />
            <el-option
              label="The Unheard"
              value="The Unheard"
            />
          </el-select>
        </div>
      </el-card>
    </el-aside>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
.el-menu--horizontal {
  --el-menu-horizontal-height: 50px;
}
</style>
