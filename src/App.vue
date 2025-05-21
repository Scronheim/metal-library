<script setup lang="ts">
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const currentTheme = ref('light')
</script>

<template>
  <el-header class="flex items-center bg-zinc-200 font-bold dark:bg-zinc-800">
    <div class="flex grow items-center justify-end">
      <el-switch
        inactive-text="Светлая"
        inactive-value="light"
        active-text="Тёмная"
        active-value="dark"
        v-model="currentTheme"
        @change="toggleDark()"
      />
    </div>
  </el-header>
</template>

<style scoped></style>
