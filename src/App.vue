<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

import { useStore } from '@/stores/store'

const store = useStore()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const currentTheme = ref('light')
const activeIndex = ref('traders')

onMounted(() => {
  store.user = JSON.parse(localStorage.getItem('user'))
})
</script>

<template>
  <div class="flex items-center bg-zinc-200 font-bold dark:bg-zinc-800">
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      router
      style="width: 250px"
    >
      <el-sub-menu index="traders">
        <template #title>Торговцы</template>
        <el-sub-menu index="prapor">
          <template #title>Прапор</template>
          <el-menu-item index="/traders/prapor/quests">Квесты</el-menu-item>
          <el-menu-item index="/traders/prapor/trade">Ассортимент</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="therapist">
          <template #title>Терапевт</template>
          <el-menu-item index="/traders/therapist/quests">Квесты</el-menu-item>
          <el-menu-item index="/traders/therapist/trade">Ассортимент</el-menu-item>
        </el-sub-menu>
      </el-sub-menu>
    </el-menu>
  </div>
  <el-main>
    <RouterView />
  </el-main>
</template>

<style scoped></style>
